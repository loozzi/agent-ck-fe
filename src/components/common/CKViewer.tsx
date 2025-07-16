import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

interface CKViewerProps {
  content: string
}

const CKViewer: React.FC<CKViewerProps> = ({ content }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={content}
      disabled={true}
      config={{
        toolbar: []
      }}
    />
  )
}

export default CKViewer
