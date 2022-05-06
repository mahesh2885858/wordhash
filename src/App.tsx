import { nanoid } from 'nanoid'
import React, { HtmlHTMLAttributes, useEffect, useState } from 'react'
import { ImExit } from "react-icons/im"
import Calender from './components/Calender'
const App = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageurl, setImageurl] = useState<any[]>([])
  const [daysOfMonths, setDaysOfMonths] = useState<{ id: string, day: string, date: number }[]>([])
  const monthBoard = [

    [{ day: "sun" }, { day: "mon" }, { day: "tue" }, { day: "wed" }, { day: "thu" }, { day: "fri" }, { day: "sat" }],
    [{ day: "sun" }, { day: "mon" }, { day: "tue" }, { day: "wed" }, { day: "thu" }, { day: "fri" }, { day: "sat" }],
    [{ day: "sun" }, { day: "mon" }, { day: "tue" }, { day: "wed" }, { day: "thu" }, { day: "fri" }, { day: "sat" }],
    [{ day: "sun" }, { day: "mon" }, { day: "tue" }, { day: "wed" }, { day: "thu" }, { day: "fri" }, { day: "sat" }],
    [{ day: "sun" }, { day: "mon" }, { day: "tue" }, { day: "wed" }, { day: "thu" }, { day: "fri" }, { day: "sat" }],
  ]
  const monthArray: { id: string, day: string, date: number }[] = []
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const week1 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const getDays = (month: number) => {
    const numberOfDaysInMonth = new Date(currentYear, month - 1, 0).getDate()
    // console.log(numberOfDaysInMonth)
    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      const dateValue = new Date(currentYear, month, i)
      const date = dateValue.getDate()
      const day = weekdays[dateValue.getDay()]
      let week: number;

      const dayobj = {
        id: nanoid(),
        day,
        date
      }
      monthArray.push(dayobj)
    }
    setDaysOfMonths(prevdays => [...monthArray])
  }





  const GoToNextMonth = () => {

    setCurrentMonth((prev) => {
      if (prev < 11) return prev + 1
      else {
        setCurrentYear(prevYear => prevYear + 1)
        return 0
      }
    })
  }
  const uploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageData: any = []
    const filesArray = Array.from(e.target.files!).map((file) => {
      const reader = new FileReader()
      const result = reader.readAsDataURL(file)

      reader.addEventListener('load', (e) => imageData.push(e.target?.result))
    })
    setImageurl(pre => imageData)
    // const imageFiles = e.target.files!
    // console.log(filesArray)
    // console.dir(e.target.files![0])

    // const selectedFiles = []
    // for(let i=0; i<e.target.files!?.length,i++;){

    // selectedFiles.push(URL.createObjectURL(e.target.files?.item(i)))

    // }

    // }
  }
  const GoToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      if (prev !== 0) return prev - 1
      else {
        setCurrentYear(prevYear => prevYear - 1)
        return 11
      }
    })
  }
  useEffect(() => {

    getDays(currentMonth)
  }, [currentMonth])

  return (
    <>
      <div>App</div>

      <ImExit />
      <Calender />
      <div
        className="flex flex-row flex-wrap w-full"
      >
        {

          daysOfMonths.map((day) => {
            return <div className=' w-1/6' key={day.id}>
              <h1>{day.date}</h1>
              <h1>{day.day}</h1>
              <button className=' px-2 py-3 bg-blue-400 rounded' onClick={() => setIsModalOpen(true)}>Add Word</button>
            </div>
          })
        }
      </div>
      {
        isModalOpen ?
          <div>
            <input accept='image/*' type="file" multiple onChange={uploadFiles} />
            {/* <input type="file" onChange={uploadFiles} /> */}


          </div>
          : undefined
      }
      <button onClick={GoToPreviousMonth}>Back</button>
      <button onClick={GoToNextMonth}>Next</button>
      {
        imageurl.map((image) => {
          return <img src={image} alt="dfd" />
        })
      }
    </>
  )
}

export default App