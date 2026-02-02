import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-8">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>

        <Link href="/" className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white transition-all bg-[#8C1D40] rounded-xl hover:bg-[#6e1632] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
