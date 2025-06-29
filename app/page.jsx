"use client";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white rounded-xl shadow-2xl p-10 max-w-md w-full text-center">
                <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">Task Manager App</h1>
                <p className="text-gray-600 mb-8 text-lg">Organize your tasks, boost your productivity, and manage your work efficiently.</p>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => router.push('/register')}
                        className="w-full py-3 px-4 border border-indigo-600 text-lg font-medium rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
} 