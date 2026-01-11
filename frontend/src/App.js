import { useEffect, useState, useRef } from "react";
import "./App.css";

/* =====================
   CONFIG – CHANGE NAME
===================== */
const PERSON_NAME = "Moti";

/* =====================
   MEMORIES (STABLE)
===================== */
const MEMORIES = [
  { type: "image", src: "/images/image 1.jpg" },
  { type: "image", src: "/images/image 2.jpg" },
  { type: "image", src: "/images/image 3.jpg" },
  { type: "image", src: "/images/image 4.jpg" },
  // { type: "video", src: "/images/tanya 5.mp4" },
  { type: "image", src: "/images/image 5.jpg" },
  // { type: "video", src: "/images/tanya 7.mp4" },
];

export default function App() {
  const [screen, setScreen] = useState(0);
  const [lit, setLit] = useState(false);
  const poppedRef = useRef(0);

  const [timeLeft, setTimeLeft] = useState({});
  const [flippedCard, setFlippedCard] = useState(null);
  const [galleryCompleted, setGalleryCompleted] = useState(false);

  const [popped, setPopped] = useState([false, false, false, false]);
  const [currentMemory, setCurrentMemory] = useState(0);

  const balloonMessages = [
    "You are amazing 💖",
    "Never stop smiling 😊",
    "You light up every room ✨",
    "Today is all about YOU 🎉",
  ];

  const cardMessages = [
    "You have the kindest heart ❤️",
    "Your presence feels like home 💞",
    "You are pure magic ✨",
  ];

  /* =====================
     GALLERY AUTO SLIDESHOW
===================== */
  useEffect(() => {
    if (screen !== 7) return;

    const current = MEMORIES[currentMemory];
    const delay = current.type === "video" ? 6000 : 3000;

    const timer = setTimeout(() => {
      if (currentMemory === MEMORIES.length - 1) {
        setGalleryCompleted(true);
      } else {
        setCurrentMemory((prev) => prev + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [screen, currentMemory]);

  /* Reset gallery when entering */
  useEffect(() => {
    if (screen === 7) {
      setCurrentMemory(0);
      setGalleryCompleted(false);
    }
  }, [screen]);

  /* =====================
     COUNTDOWN LOGIC
===================== */
  useEffect(() => {
    if (screen !== 0) return;

    const birthdayDate = new Date("2026-01-13T00:00:00");

    const timer = setInterval(() => {
      const diff = birthdayDate - new Date();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeout(() => setScreen(1), 1200);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen]);

  /* =====================
     NAVIGATION
===================== */
  const next = () => {
    setFlippedCard(null);
    setPopped([false, false, false, false]);
    poppedRef.current = 0;
    setScreen((s) => s + 1);
  };

  const replay = () => {
    poppedRef.current = 0;
    setLit(false);
    setFlippedCard(null);
    setPopped([false, false, false, false]);
    setScreen(0);
  };

  /* =====================
     BALLOON POP
===================== */
  const popBalloon = (index) => {
    if (popped[index]) return;

    const newPopped = [...popped];
    newPopped[index] = true;
    setPopped(newPopped);

    poppedRef.current += 1;

    setTimeout(() => {
      setPopped((prev) => {
        const cleared = [...prev];
        cleared[index] = null;
        return cleared;
      });
    }, 1200);

    if (poppedRef.current === 4) {
      setTimeout(next, 1800);
    }
  };

  return (
    <div className="app">
      {/* 1 Countdown */}
      {screen === 0 && (
        <div className="screen">
          <h2 className="pinkplus">Countdown to {PERSON_NAME}'s Day 💖</h2>

          <div className="countdown">
            {[
              { label: "Days", value: timeLeft.days || 0 },
              { label: "Hours", value: timeLeft.hours || 0 },
              { label: "Minutes", value: timeLeft.minutes || 0 },
              { label: "Seconds", value: timeLeft.seconds || 0 },
            ].map((item, i) => (
              <div className="countdown-card" key={i}>
                <div className="countdown-flip">
                  <div className="countdown-front">{item.value}</div>
                  <div className="countdown-back">{item.value}</div>
                </div>
                <small>{item.label}</small>
              </div>
            ))}
          </div>

          <p className="opening-date">
            🌸 The magic begins on <b>13 January 2026</b> 🌸
          </p>
          {/* <p className="subtle">
            Every second brings us closer ✨
          </p> */}

        </div>
      )}

      {/* 2 Intro */}
      {screen === 1 && (
        <div className="screen">
          <div className="cute">🐻</div>
          <h1 className="pink">
            {PERSON_NAME} was born{" "}
            <span className="highlight">24 years ago</span> today 💕
          </h1>
          <button onClick={next}>🎁 Start the surprise</button>
        </div>
      )}

      {/* 3 Cake */}
      {screen === 2 && (
        <div className="screen cake-screen">
          <div className="simple-cake">
            <div className="cake-top">
              <div className="candle">
                {lit && <span className="flame"></span>}
              </div>
            </div>
            <div className="cake-body"></div>
          </div>

          {!lit ? (
            <button onClick={() => setLit(true)}>🔥 Light Candle</button>
          ) : (
            <button
              onClick={() => {
                setLit(false);
                setTimeout(next, 1000);
              }}
            >
              💨 Blow Candle
            </button>
          )}
        </div>
      )}

      {/* 4 Wish */}
      {screen === 3 && (
        <div className="screen">
          <h1 className="pink">Happy Birthday {PERSON_NAME} 🎂💖</h1>
          <button onClick={next}>🎈 Pop the Balloons</button>
        </div>
      )}

      {/* 5 Balloons */}
      {screen === 4 && (
        <div className="screen">
          <p className="pink">Pop the balloons 🎈</p>

          <div className="balloons">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="balloon-slot"
                onClick={() => popBalloon(i)}
              >
                {popped[i] === false && (
                  <div className={`balloon b${i + 1}`}></div>
                )}
                {popped[i] === true && (
                  <div className="balloon-message-inside">
                    {balloonMessages[i]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6 Text */}
      {screen === 5 && (
        <div className="screen">
          <h1
            className="pink"
            style={{ fontSize: "clamp(28px, 6vw, 52px)" }}
          >
            You are a Moti 💕
          </h1>
          <button onClick={next}>Next →</button>
        </div>
      )}

      {/* 7 Flip Cards */}
      {screen === 6 && (
        <div className="screen">
          <h2 className="pink">Tap the cards 💌</h2>

          <div className="flip-cards">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flip-card ${flippedCard === i ? "flipped" : ""
                  }`}
                onClick={() =>
                  setFlippedCard(flippedCard === i ? null : i)
                }
              >
                <div className="flip-inner">
                  <div className="flip-front">💖</div>
                  <div className="flip-back">{cardMessages[i]}</div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={next}>📩 Open The Gallery</button>
        </div>
      )}

      {/* 8 Memories Gallery */}
      {screen === 7 && (
        <div className="screen memories-screen">
          <h2 className="pink">Our Memories 💖</h2>

          <div className="memory-view">
            {MEMORIES[currentMemory].type === "image" ? (
              <img
                src={MEMORIES[currentMemory].src}
                alt="memory"
                className="memory-media"
              />
            ) : (
              <video
                src={MEMORIES[currentMemory].src}
                className="memory-media"
                controls
                playsInline
              />
            )}
          </div>

          <div className="gallery-wait">
            {!galleryCompleted
              ? "⏳ Wait for completing the gallery…"
              : "💖 Hope these memories made you smile"}
          </div>

          {galleryCompleted && (
            <button onClick={next}>Next →</button>
          )}
        </div>
      )}

      {/* 9 Letter */}
      {screen === 8 && (
        <div className="screen">
          <div className="letter">
            You deserve endless happiness, love, aur har din ki smile 💖
            Thodi si drama queen ho, thodi si full-on bandar 😜
            Kabhi annoying lagti ho, par bina tumhare life bilkul boring hoti 💕
            Stay the same meri moti, bas mujhe zyada pareshan mat karna 😆💖
          </div>
          <button onClick={next}>Next →</button>
        </div>
      )}

      {/* 10 Gift */}
      {screen === 9 && (
        <div className="screen">
          <h2 className="pink">Tap the gift box 💌</h2>
          <div className="gift" onClick={next}>
            🎁
          </div>
        </div>
      )}

      {/* 11 Final */}
      {screen === 10 && (
        <div className="screen">
          <div className="let">
            Lots of love for you, {PERSON_NAME} ❤️
            Tum meri life ka wo constant ho jo hamesha saath rehta hai, chahe situation kaisi bhi ho 🤍
            You are my comfort place 💫 Kabhi ladte hain, kabhi irritate karte hain,
            par dil se hamesha ek-dusre ke liye khade rehte hain 😄
            Tumhari khushi mere liye sabse important hai, baaki duniya baad mein 💕
            Zindagi mein chahe kitni bhi problems aayein, yaad rakhna tum akeli nahi ho 🤗
            Main hoon hamesha, bina kisi condition ke, bina kisi reason ke ✨
            Stay strong, stay sweet, aur hamesha apni cute si smile ke saath chamakti rehna moti 💖
          </div>
          <button onClick={replay}>🔁 Replay</button>
        </div>
      )}
    </div>
  );
}
