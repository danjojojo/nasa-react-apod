import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Main from "./components/Main"
import SideBar from "./components/SideBar"

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  function handleToggleModal(){
    setShowModal(!showModal)
  }
  
  // if the [] is empty, the function will run on page load
  // or else, the functino will only run once the variable stored in the [] has changed
  useEffect(()=> {
    async function fetchAPIData(){
      // IMPORT API KEY FROM ENV
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY
      // DO HTTP REQUEST TO LINK FROM NASA AND ATTACH API KEY
      const url = 'https://api.nasa.gov/planetary/apod' + `?api_key=${NASA_KEY}`



      // MAKE UNIQUE LOCAL KEY BY USING CURRENT DATE
      // THIS IS TO NOT CONTINUOUSLY DO API CALLS TO NASA API
      const today = (new Date()).toDateString()
      const localKey = `NASA-${today}`



      // IF LOCAL KEY EXISTS IN LOCAL STORAGE
      if(localStorage.getItem(localKey)){
        // PARSE THE JSON DATA FROM THE LOCAL KEY
        const apiData = JSON.parse(localStorage.getItem(localKey))
        setData(apiData)
        console.log('Fetched from local today')
        return
      }


      // IF LOCAL KEY DOESNT EXIST, WE CLEAR THE LOCAL STORAGE
      localStorage.clear()

      // THEN WE DO THE FF
      try {
        // FETCH DATA FROM URL -> see line 22
        const res = await fetch(url)
        // STORE THE RESULT (res) TO JSON THEN STORE IT TO apiData
        const apiData = await res.json()
        // WE STRINGIFY THE JSON DATA (apiData) THEN STORE IT TO LOCALKEY WHICH WILL BE STORED IN LOCALSTORAGE
        localStorage.setItem(localKey, JSON.stringify(apiData))
        setData(apiData)
        console.log('Fetched from API today')

      } catch (error) {
        console.log(err.message)
      }
    }
    // RUN THE FETCH DATA FUNCTION
    fetchAPIData()

  }, [])

  return (
    <>
      {data ? (<Main data={data}/>) : (
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      )}
      {showModal && (
        <SideBar data={data} handleToggleModal={handleToggleModal}/>
      )}
      {data && (
        <Footer data={data} handleToggleModal={handleToggleModal}/>
      )}
    </>
  )
}

export default App
