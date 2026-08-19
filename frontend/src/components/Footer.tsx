import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-neutral-800/90 bg-[#121417]/95 text-neutral-400 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Identidad y Copyright */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
            <span className="font-extrabold tracking-wider text-white uppercase text-xs rounded bg-neutral-950/80 px-2.5 py-1 border border-neutral-800">
              Motos Benito
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <p className="text-xs text-neutral-400">
              © {new Date().getFullYear()} Todos los derechos reservados.
            </p>
          </div>

          {/* Enlaces, Estado y Créditos */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">

            <Link 
              to="/privacidad" 
              className="text-neutral-400 transition-colors hover:text-white"
            >
              Privacidad
            </Link>

            <span className="text-neutral-700">|</span>

            {/* Badge de autor con micro-interacción */}
            <a
              href="https://javifullstackdev.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1 text-neutral-300 border border-neutral-800 transition-all hover:border-orange-500/50 hover:bg-neutral-850 hover:text-white"
            >
              <span className="text-[11px]">Desarrollado por</span>
              <span className="font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                javifullstackdev
              </span>
              <svg 
                className="h-3 w-3 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;