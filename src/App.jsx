import FontUpload from './component/fontUpload'
import FontList from './component/fontList'
import FontGroupCreate from "./component/fontGroupCreate"
import FontGroupList from './component/fontGroupList'



function App() {
  // const [file, setFile] = useState()
  // const [fonts, setFonts] = useState([])
  // const [fontUploading, setFontUploading] = useState(false)

  // const fetchFonts = async()=> {
  //   try {
  //     const res = await fetch("http://localhost:8000/fonts")
  //     const data = await res.json()
  //     if(res.ok) {
  //       setFonts(data.fonts)
  //     }
  //   } catch (error) {
  //     console.error(`Error fetching fonts. Error: ${error}`)
  //   }
  // }

  // useEffect(()=> {
  //   fetchFonts()
  // },[])

  // useEffect(()=> {
  //   if(fontUploading){
  //     fetchFonts()
  //     setFontUploading(false)
  //   }
  // },[fontUploading])

  return (
    <main className='container mx-auto flex flex-col gap-y-10 items-center justify-center'>
      <FontUpload />
      
      {/* {console.log("Fontsss",fonts)} */}

      <FontList />

      <FontGroupCreate />

      <FontGroupList />
    </main>
  )
}

export default App
