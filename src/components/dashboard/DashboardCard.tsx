// "use client";

// import { ReactNode, useState } from "react";
// import { useDispatch } from "react-redux";
// import { showLoader} from "@/lib/store/slices/loaderSlice";
// import { useRouter } from "next/navigation";
// interface DashboardCardProps {
//   title: string;
//   href: string;
//   children?: ReactNode;
// }

// export default function DashboardCard({ title, href, children }: DashboardCardProps) {

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const [isNavigating, setIsNavigating] = useState(false);

//   const handleClick = () => {
//     if(isNavigating) return;
//     setIsNavigating(true);
//     dispatch(showLoader(`Loading ${title}..`));
//     router.push(href)
//   }

//   return (
//       <div onClick={handleClick} className="bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer text-white hover:bg-gray-700 transition-all duration-200 hover:scale-105">
//         <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
//         {children}
//       </div>
//   );
// }

"use client";

import { ReactNode, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoader } from "@/lib/store/slices/loaderSlice";
import { useRouter } from "next/navigation";

interface DashboardCardProps {
  title: string;
  href: string;
  children?: ReactNode;
  gradient?: string;
}

export default function DashboardCard({
  title,
  href,
  children,
  gradient,
}: DashboardCardProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    dispatch(showLoader(`Loading ${title}...`));
    router.push(href);
  };

  return (
    <div className="card-container" style={{ perspective: "50em" }}>
      <div
        className="card"
        onClick={handleClick}
        style={
          {
            "--bi":
              gradient ||
              "repeating-linear-gradient(30deg, #1a1a1a 0 0.25em, #2a2a2a 0 1em)",
          } as React.CSSProperties
        }
      >
        <h3>{title}</h3>
        {children}
        <div className="layers">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="layer"
              style={{ "--tz": `${i * -4}px` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
      {/* <style jsx>{`
        .card {
          position: relative;
          width: 100%;
          padding: 3em;
          color: #fff;
          transform: rotateY(20deg) rotateX(10deg);
          transform-style: preserve-3d;
          transition: transform 0.6s;
          cursor: pointer;
        }
        
        .card:hover {
          transform: rotateY(-20deg) rotateX(-10deg);
        }
        
        .card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        
        .layers {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          z-index: -1;
        }
        
        .layer {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 1em;
          background-image: var(--bi);
          transform: translateZ(var(--tz));
          box-shadow: 0 0 0.5em rgba(0,0,0,0.5) inset;
        }
        
        .layer:last-child {
          box-shadow: 0 0 0.5em rgba(0,0,0,0.5) inset, 0 0 10px rgba(0,0,0,0.8);
        }
      `}</style> */}

      <style jsx>{`
        .card-container {
          perspective: 50em;
          /* Add container boundaries */
          overflow: hidden;
          border-radius: 1em;
        }

        .card {
          position: relative;
          width: 100%;
          padding: 3em;
          color: #fff;
          transform: rotateY(20deg) rotateX(10deg);
          transform-style: preserve-3d;
          transition: transform 0.6s, box-shadow 0.7s, border 0.7s;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 1em;
          /* Don't add overflow: hidden here - it breaks 3D */
        }

        .card::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -150%;
          width: 100%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            /* Increased opacity for better visibility */ transparent
          );
          transform: rotate(-45deg);
          transition: all 0.7s ease;
          pointer-events: none;
          z-index: 1;
          /* Contain within card using clip-path */
          clip-path: inset(0);
          border-radius: 1em;
        }

        .card:hover {
          transform: rotateY(-20deg) rotateX(-10deg) scale(1.015);
          border: 1px solid rgba(255, 255, 255, 0.27); 
        }

        .card:hover::before {
          top: -150%;
          left: 150%;
          filter: brightness(0.8);
        }

        .card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .layers {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          z-index: -1;
          border-radius: 1em; /* Add border radius to layers container */
        }

        .layer {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 1em; /* Each layer needs border-radius */
          background-image: var(--bi);
          transform: translateZ(var(--tz));
          box-shadow: 0 0 0.5em rgba(255,255,255, 0.5) inset;
        }

        .layer:last-child {
          box-shadow: 0 0 0.5em rgba(255,255,255, 0.5) inset,
            0 0 20px rgba(255,255,255, 0.8);
        }
      `}</style>
    </div>
  );
}
