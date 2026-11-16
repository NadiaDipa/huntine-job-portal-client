/**
 * Persistent postinstall fix for next-themes on React 19.
 *
 * React 19 throws "Encountered a script tag while rendering React component."
 * because `next-themes` renders its <script> during client renders too.
 *
 * The upstream fix (pacocoursey/next-themes#386) makes `ThemeScript` render
 * `null` on the client while still rendering the script on the server, which
 * is what we do here by patching the published `dist` files in place.
 *
 * This script is idempotent, so running it repeatedly is safe. It exits
 * successfully even when `next-themes` is missing or already fixed, so it can
 * never break an install.
 */
import fs from "node:fs"
import path from "node:path"

/** Dist files that contain the memoized `ThemeScript` component. */
const DIST_FILES = ["dist/index.mjs", "dist/index.js"]

/** The `nonce` prop name differs per bundle because of minified locals. */
const NONCE_PROPS = ["d", "m"]

const THEME_SCRIPT_ANCHOR = "scriptProps:w})=>{let p=JSON.stringify"
const PATCHED_THEME_SCRIPT =
  'scriptProps:w})=>{if(typeof window!="undefined")return null;let p=JSON.stringify'

function patchFile(filePath) {
  let source = fs.readFileSync(filePath, "utf8")
  const original = source

  // 1. Stop `ThemeScript` from rendering on the client.
  source = source.replace(THEME_SCRIPT_ANCHOR, PATCHED_THEME_SCRIPT)

  // 2. The client branch is gone, so the `nonce` prop no longer needs the
  //    `typeof window === "undefined"` guard.
  for (const nonce of NONCE_PROPS) {
    source = source.replace(
      `nonce:typeof window=="undefined"?${nonce}:""`,
      `nonce:${nonce}`
    )
  }

  if (source === original) {
    return false
  }

  fs.writeFileSync(filePath, source)
  return true
}

function main() {
  const packageRoot = path.join(process.cwd(), "node_modules", "next-themes")
  const packageJson = path.join(packageRoot, "package.json")

  if (!fs.existsSync(packageJson)) {
    console.log("[patch-next-themes] next-themes is not installed, skipping.")
    return
  }

  const { version } = JSON.parse(fs.readFileSync(packageJson, "utf8"))
  let patched = 0

  for (const relative of DIST_FILES) {
    const filePath = path.join(packageRoot, relative)

    if (!fs.existsSync(filePath)) {
      continue
    }

    if (patchFile(filePath)) {
      patched += 1
    }
  }

  if (patched > 0) {
    console.log(
      `[patch-next-themes] Applied React 19 script-tag fix to next-themes@${version}.`
    )
    return
  }

  console.log(
    `[patch-next-themes] next-themes@${version} is already patched or no longer needs patching.`
  )
}

main()
