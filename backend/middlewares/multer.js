import multer from "multer"
import os from "os"
import path from "path"
import fs from "fs"

const tmpDir = path.join(os.tmpdir(), "vingo_uploads")
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, tmpDir)
   },
   filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`
      cb(null, uniqueName)
   }
})

export const upload = multer({ storage })