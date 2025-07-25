import FontUpload from './component/fontUpload'
import FontList from './component/fontList'
import FontGroupCreate from "./component/fontGroupCreate"
import FontGroupList from './component/fontGroupList'



function App() {

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
