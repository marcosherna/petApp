import { useEffect } from "react";
import sal from "sal.js"; 

export default function App() {
  useEffect(() => {
    sal({
      root: null,
      threshold: 0.3,    
      once: false,       
    });
  }, []);

  return (
    <div className="app-container">
      <section className="h-screen flex items-center justify-center bg-amber-200">
        <h1
          data-sal="slide-up"
          data-sal-delay="200"
          data-sal-duration="800"
          className="text-5xl font-bold text-indigo-600"
        >
          ¡Hola Mundo!
        </h1>
      </section>

      <section className="h-screen flex flex-col items-center justify-center space-y-8 bg-blue-300">
        <p
          data-sal="fade"
          data-sal-duration="700"
          className="text-2xl text-gray-700"
        >
          Esta animación aparece y desaparece al hacer scroll.
        </p>
        <p
          data-sal="zoom-in"
          data-sal-delay="300"
          data-sal-duration="800"
          className="text-xl text-gray-500"
        >
          Desplázate hacia arriba y abajo para volver a verla.
        </p>
      </section>

      <section className="h-screen flex items-center justify-center">
        <h2
          data-sal="slide-right"
          data-sal-duration="700"
          className="text-4xl text-emerald-500"
        >
          Scroll Suave y Sin Barra
        </h2>
      </section>
    </div>
  );
}
