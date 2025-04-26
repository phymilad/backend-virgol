import { BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname, join } from "path";

export type CallbackDestination = (error: Error | null, destination: string) => void;
export type CallbackFileName = (error: Error | null, filename: string) => void;
type MulterFile = Express.Multer.File
export function multerDestination(fieldName: string){
    return (req: Request, file: MulterFile, callback: CallbackDestination): void => {
        let path = join("public", "uploads", fieldName)
        mkdirSync(path, { recursive: true })
        callback(null, path)
    }
}
export function multerFileName(req: Request, file: MulterFile, callback: CallbackFileName): void {
    const ext = extname(file.originalname).toLowerCase()
    if(![".png", ".jpg", ".jpeg"].includes(ext)) {
        callback(new BadRequestException("Invalid file format"), "")
    } else {
        const filename = `${Date.now()}${ext}`
        callback(null, filename)
    }
}

export function multerStorage (folderName: string) {
    return diskStorage({
        destination: multerDestination(folderName),
        filename: multerFileName,
    })
}