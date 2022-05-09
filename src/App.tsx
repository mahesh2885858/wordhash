import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

const App = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadDate, setUploadDate] = useState("");
  const [imagefromapi, setImagefromapi] = useState<
    { imageId: string; url: string; entryId: string }[]
  >([]);
  const [imageurl, setImageurl] = useState<{ image: string; id: string }[]>([]);
  const [daysOfMonths, setDaysOfMonths] = useState<
    { id: string; day: string; date: number }[]
  >([]);
  const monthBoard = [
    [
      { day: "sun" },
      { day: "mon" },
      { day: "tue" },
      { day: "wed" },
      { day: "thu" },
      { day: "fri" },
      { day: "sat" },
    ],
    [
      { day: "sun" },
      { day: "mon" },
      { day: "tue" },
      { day: "wed" },
      { day: "thu" },
      { day: "fri" },
      { day: "sat" },
    ],
    [
      { day: "sun" },
      { day: "mon" },
      { day: "tue" },
      { day: "wed" },
      { day: "thu" },
      { day: "fri" },
      { day: "sat" },
    ],
    [
      { day: "sun" },
      { day: "mon" },
      { day: "tue" },
      { day: "wed" },
      { day: "thu" },
      { day: "fri" },
      { day: "sat" },
    ],
    [
      { day: "sun" },
      { day: "mon" },
      { day: "tue" },
      { day: "wed" },
      { day: "thu" },
      { day: "fri" },
      { day: "sat" },
    ],
  ];
  const monthArray: { id: string; day: string; date: number }[] = [];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const week1 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const imageFlag = "data:image/jpeg;base64,";
  const getDays = (month: number) => {
    const numberOfDaysInMonth = new Date(currentYear, month - 1, 0).getDate();

    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      const dateValue = new Date(currentYear, month, i);
      const date = dateValue.getDate();
      const day = weekdays[dateValue.getDay()];
      let week: number;

      const dayobj = {
        id: nanoid(),
        day,
        date,
      };
      monthArray.push(dayobj);
    }
    setDaysOfMonths((prevdays) => [...monthArray]);
  };
  const GoToNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev < 11) return prev + 1;
      else {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0;
      }
    });
  };
  const uploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageData: any = [];
    const filesArray = Array.from(e.target.files!).map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", (e) => {
        const result = e.target?.result as string;
        setImageurl((prev) => {
          // const imgdata = {image:result}
          return [...prev, { image: result, id: nanoid() }];
        });
      });
    });
  };
  const GoToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      if (prev !== 0) return prev - 1;
      else {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11;
      }
    });
  };
  const uploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const reqBody = imageurl.map((url) => ({
      url: url.image,
    }));
    try {
      const upload = await axios.post("/admin/addcluecards", {
        word: "toast",
        date: uploadDate,
        imageurl: reqBody,
      });
    } catch (Err) {
      console.log(Err);
    }
  };
  const onModalOpen = (d: string) => {
    setIsModalOpen(true);
    setUploadDate(d);
  };
  const arrayBufferToBase64 = (buffer: any) => {
    let binary = "";
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };
  const getImages = async () => {
    try {
      const dataimage = await axios.get("/admin/getimages");
      console.log(dataimage.data.images);
      const mainId = dataimage.data._id;
      const newDAta = dataimage.data.images.map((image: any) => {
        const base64string = arrayBufferToBase64(image.image.data);
        const imgObject = {
          imageId: image._id,
          entryId: mainId,
          url: base64string,
        };
        return imgObject;
      });

      setImagefromapi(newDAta);
    } catch (err) {
      console.log(err);
    }
  };
  const updateEntry = async (imageId: string, entryId: string) => {
    const data = await axios.put("/admin/updateentry", {
      imageId,
      entryId,
    });
    console.log(data);
  };
  useEffect(() => {
    getDays(currentMonth);
  }, [currentMonth]);

  return (
    <>
      <div>App</div>

      <div className="flex flex-row flex-wrap w-full">
        {daysOfMonths.map((day) => {
          return (
            <div className=" w-1/6" key={day.id}>
              <h1>{day.date}</h1>
              <h1>{day.day}</h1>
              <button
                className=" px-2 py-3 bg-blue-400 rounded"
                onClick={() =>
                  onModalOpen(
                    new Date(
                      currentYear,
                      currentMonth,
                      day.date
                    ).toLocaleDateString()
                  )
                }
              >
                Add Word
              </button>
            </div>
          );
        })}
      </div>
      {isModalOpen ? (
        <div>
          <form
            onSubmit={uploadImage}
            action="/profile"
            method="post"
            encType="multipart/form-data"
          >
            <input type="file" name="clue-card" onChange={uploadFiles} />
            <button>upload</button>
          </form>
        </div>
      ) : undefined}
      <button onClick={GoToPreviousMonth}>Back</button>
      <button onClick={GoToNextMonth}>Next</button>
      {imageurl.map((image) => {
        return <img key={image.id} src={image.image} alt="dfd" />;
      })}
      <button onClick={getImages}>GEtIMges</button>
      <div>
        {imagefromapi.map((image) => {
          return (
            <div key={image.imageId}>
              <img src={imageFlag + image.url} width={200} alt="" />
              <button
                onClick={() => updateEntry(image.imageId, image.entryId)}
                className=" bg-red-400 rounded-lg p-2 mr-2"
              >
                Delete
              </button>
              <button className=" bg-blue-400 rounded-lg p-2">Edit</button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;
