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


///////////////////////////////////// #d Style card /////////////////////////////////////////////////////



// "use client";

// import { ReactNode, useState } from "react";
// import { useDispatch } from "react-redux";
// import { showLoader } from "@/lib/store/slices/loaderSlice";
// import { useRouter } from "next/navigation";

// interface DashboardCardProps {
//   title: string;
//   href: string;
//   children?: ReactNode;
//   gradient?: string;
// }

// export default function DashboardCard({
//   title,
//   href,
//   children,
//   gradient,
// }: DashboardCardProps) {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const [isNavigating, setIsNavigating] = useState(false);

//   const handleClick = () => {
//     if (isNavigating) return;
//     setIsNavigating(true);
//     dispatch(showLoader(`Loading ${title}...`));
//     router.push(href);
//   };

//   return (
//     <div className="card-container" style={{ perspective: "50em" }}>
//       <div
//         className="card"
//         onClick={handleClick}
//         style={
//           {
//             "--bi":
//               gradient ||
//               "repeating-linear-gradient(30deg, #1a1a1a 0 0.25em, #2a2a2a 0 1em)",
//           } as React.CSSProperties
//         }
//       >
//         <h3>{title}</h3>
//         {children}
//         <div className="layers">
//           {[...Array(10)].map((_, i) => (
//             <div
//               key={i}
//               className="layer"
//               style={{ "--tz": `${i * -4}px` } as React.CSSProperties}
//             />
//           ))}
//         </div>
//       </div>
//       {/* <style jsx>{`
//         .card {
//           position: relative;
//           width: 100%;
//           padding: 3em;
//           color: #fff;
//           transform: rotateY(20deg) rotateX(10deg);
//           transform-style: preserve-3d;
//           transition: transform 0.6s;
//           cursor: pointer;
//         }
        
//         .card:hover {
//           transform: rotateY(-20deg) rotateX(-10deg);
//         }
        
//         .card h3 {
//           font-size: 1.5rem;
//           font-weight: 600;
//           margin-bottom: 0.5rem;
//           text-align: center;
//         }
        
//         .layers {
//           position: absolute;
//           left: 0;
//           top: 0;
//           width: 100%;
//           height: 100%;
//           transform-style: preserve-3d;
//           z-index: -1;
//         }
        
//         .layer {
//           position: absolute;
//           left: 0;
//           top: 0;
//           width: 100%;
//           height: 100%;
//           border-radius: 1em;
//           background-image: var(--bi);
//           transform: translateZ(var(--tz));
//           box-shadow: 0 0 0.5em rgba(0,0,0,0.5) inset;
//         }
        
//         .layer:last-child {
//           box-shadow: 0 0 0.5em rgba(0,0,0,0.5) inset, 0 0 10px rgba(0,0,0,0.8);
//         }
//       `}</style> */}

//       <style jsx>{`
//         .card-container {
//           perspective: 50em;
//           /* Add container boundaries */
//           overflow: hidden;
//           border-radius: 1em;
//         }

//         .card {
//           position: relative;
//           width: 100%;
//           padding: 3em;
//           color: #fff;
//           transform: rotateY(20deg) rotateX(10deg);
//           transform-style: preserve-3d;
//           transition: transform 0.6s, box-shadow 0.7s, border 0.7s;
//           cursor: pointer;
//           border: 1px solid transparent;
//           border-radius: 1em;
//           /* Don't add overflow: hidden here - it breaks 3D */
//         }

//         .card::before {
//           content: "";
//           position: absolute;
//           top: -50%;
//           left: -150%;
//           width: 100%;
//           height: 200%;
//           background: linear-gradient(
//             90deg,
//             transparent,
//             rgba(255, 255, 255, 0.3),
//             /* Increased opacity for better visibility */ transparent
//           );
//           transform: rotate(-45deg);
//           transition: all 0.7s ease;
//           pointer-events: none;
//           z-index: 1;
//           /* Contain within card using clip-path */
//           clip-path: inset(0);
//           border-radius: 1em;
//         }

//         .card:hover {
//           transform: rotateY(-20deg) rotateX(-10deg) scale(1.015);
//           border: 1px solid rgba(255, 255, 255, 0.27); 
//         }

//         .card:hover::before {
//           top: -150%;
//           left: 150%;
//           filter: brightness(0.8);
//         }

//         .card h3 {
//           font-size: 1.5rem;
//           font-weight: 600;
//           margin-bottom: 0.5rem;
//           text-align: center;
//           position: relative;
//           z-index: 2;
//         }

//         .layers {
//           position: absolute;
//           left: 0;
//           top: 0;
//           width: 100%;
//           height: 100%;
//           transform-style: preserve-3d;
//           z-index: -1;
//           border-radius: 1em; /* Add border radius to layers container */
//         }

//         .layer {
//           position: absolute;
//           left: 0;
//           top: 0;
//           width: 100%;
//           height: 100%;
//           border-radius: 1em; /* Each layer needs border-radius */
//           background-image: var(--bi);
//           transform: translateZ(var(--tz));
//           box-shadow: 0 0 0.8em rgba(0,0,0, 0.7) inset;
//         }

//         .layer:last-child {
//           box-shadow: 0 0 0.7em rgba(0,0,0, 0.8) inset,
//             0 0 20px rgba(0,0,0, 0.8);
//         }
//       `}</style>
//     </div>
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
  gradient?: string;
  cardNumber?: string;
  children?: ReactNode;
}

export default function DashboardCard({ 
  title, 
  href, 
  gradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  cardNumber = "01",
  children 
}: DashboardCardProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    dispatch(showLoader(`Loading ${title}..`));
    router.push(href);
  };

  return (
    <div className="card-wrapper">
      <div className="card-container" onClick={handleClick}>
        <div className="card-box">
          <div className="card-content ">
            <h2 className="">{cardNumber}</h2>
            <h3>{title}</h3>
            {children}
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-wrapper {
          position: relative;
          min-width: 320px;
          height: 200px;
          box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.2),
            inset -5px -5px 15px rgba(255, 255, 255, 0.1),
            5px 5px 15px rgba(0, 0, 0, 0.3), 
            -5px -5px 15px rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          transition: 0.5s;
          cursor: pointer;
        }

        .card-container {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          background: #2a2b2f;
          border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          transition: 0.5s;
        }

        .card-container:hover {
          transform: translateY(-10px);
        }

        .card-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: rgba(255, 255, 255, 0.03);
        }

        .card-container::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -150%;
          width: 100%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: rotate(-45deg);
          transition: all 0.7s ease;
          pointer-events: none;
        }

        .card-container:hover::after {
          top: -150%;
          left: 150%;
        }

        .card-box {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 20px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${gradient};
          border-radius: 15px;
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        .card-content h2 {
          position: absolute;
          top: -60px;
          left: 0px;
          font-size: 6rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.1);
          z-index: 0;
          line-height: 1;
        }

        .card-content h3 {
          font-size: 1.8rem;
          color: #fff;
          font-weight: 600;
          z-index: 1;
          transition: 0.5s;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          position: relative;
        }
      `}</style>
    </div>
  );
}