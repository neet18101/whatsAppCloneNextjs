import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);
  const [isContextMenu, setIsContextMenu] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX, y: e.pageY });
    setIsContextMenu(true);
  };
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  // show capture photo
  const [showCapturePhoto, setShowCapturePhoto] = useState(false)
  // when grabPhoto will true
  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  const contextMenuOptions = [
    { name: "Take Photo", callback: () => {
      setShowCapturePhoto(true);
    } },
    {
      name: "Choose From Library",
      callback: () => {
        setShowPhotoLibrary(true);
      },
    },
    {
      name: "Upload Photo",
      callback: () => {
        setGrabPhoto(true);
      },
    },
    {
      name: "Remove Photo",
      callback: () => {
        setImage("/default_avatar.png");
      },
    },
  ];

  const photoPickerChange = async (e) => {
    // alert("hello");
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = function (event) {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result);
    };
    reader.readAsDataURL(file);

    setTimeout(() => {
      console.log(data.src);
      setImage(data.src);
    }, 100);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "lg" && (
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              id="context-opener"
              className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 ${
                hover ? "visible" : "hidden"
              }`}
              onClick={(e) => showContextMenu(e)}
            >
              <FaCamera
                className="text-2xl"
                id="context-opener"
                onClick={(e) => showContextMenu(e)}
              />
              <span onClick={(e) => showContextMenu(e)}>
                Change <br /> Profile Photo
              </span>
            </div>
            <div className=" flex items-center justify-center h-60 w-60 ">
              <Image
                src={image}
                alt="avatar"
                className="rounded-full object-cover"
                fill
              />
            </div>
          </div>
        )}
      </div>
      {isContextMenu && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenu}
          setContextMenu={setIsContextMenu}
        />
      )}
      {
        showCapturePhoto && (
          <CapturePhoto setImage={setImage} hide={setShowCapturePhoto}/>
        )
      }
      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          onChange={photoPickerChange}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </>
  );
}

export default Avatar;
