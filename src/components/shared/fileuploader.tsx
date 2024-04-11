import {useCallback, useState} from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
    fieldChange: (file: FileWithPath[]) => void
    mediaUrl: string
}

const FileUploader = ( {fieldChange} : FileUploaderProps) => {
    const [file, setFile] = useState<File[]> ([])
    const [fileUrl, setFileUrl] = useState('')
    
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles)
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
      }, [file])
      const {getRootProps, getInputProps} = useDropzone({onDrop, accept: {'image/*' : ['.jpg', '.png', '.jpeg']}})

return (//from documentation
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className="cursor-pointer"/>
      {
        fileUrl ?(
            <>
            <div className="flex flex-1 justify-center w-full p-10">
                <img 
                src={fileUrl}
                alt="uploaded"
                className="rounded-xl"
                />
            </div>
            <p className="flex_uploader-label">Click or drag photo to change it</p>
            </>
        ) : (
        <div className="file_uploader-box">
            <img 
            src="/assets/icons/file-upload.svg"
            width={400}      
            height={36}
            alt="upload"
            />
            <h3 className="h3-bold text-center">Drag & Drop Pictures and Good Memories here</h3>
            <p className="text-sm text-center">.jpg, .png, .jpeg</p>

            <Button className="shad-button_dark-4">
                Select from your computer
            </Button>
        </div>
        )
      }
    </div>
)
}
export default FileUploader;