// src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Welcome to Stripe Connect POC</h1>
            {/* <div className="mx-auto bg-white px-2 py-20 text-center"> */}
            <h1 className="mb-3 pb-2 text-4xl font-semibold md:text-7xl"><span className="font-light">Have a look </span>Around!</h1>

            <p className="mb-3 font-light">And you will find everything you need to build a peer to peer service.</p>
            <a className="group mt-6 mb-12 inline-flex items-center pt-2 text-blue-600 hover:text-blue-500" href="#">
                <span className="group-hover:translate-y-1 flex h-10 w-10 flex-shrink-0 select-none items-center justify-center rounded-full border transition">↓</span>
                <span className="ml-4 font-medium">View Demos</span>
            </a>
            <div className="space-x-4 mb-10">
                <Link to="/register" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Register
                </Link>
                <Link to="/login" className="bg-green-500 text-white py-2 px-4 rounded">
                    Login
                </Link>
                <Link to="/dashboard" className="bg-purple-500 text-white py-2 px-4 rounded">
                    Dashboard
                </Link>
            </div>
            <div className="mx-auto flex max-w-screen-lg flex-wrap md:flex-nowrap md:space-x-3 md:px-20 p-2 justify-center">
                <div className="p-10 mb-6 w-full max-w-full flex-shrink-0 rounded-lg bg-blue-600 py-2 text-white shadow md:w-1/3 md:py-8">
                    <div className="mb-1 text-3xl font-semibold">5+</div>
                    <div className="mb-2 text-lg text-gray-100">Components</div>
                </div>
                <div className="p-10 mb-6 w-full max-w-full flex-shrink-0 rounded-lg bg-blue-600 py-2 text-white shadow md:w-1/3 md:py-8">
                    <div className="mb-1 text-3xl font-semibold">20</div>
                    <div className="mb-1 text-lg text-gray-100">Stripe Calls</div>
                </div>
                <div className="p-10 mb-6 w-full max-w-full flex-shrink-0 rounded-lg bg-blue-600 py-2 text-white shadow md:w-1/3 md:py-8">
                    <div className="mb-1 text-3xl font-semibold">15</div>
                    <div className="mb-1 text-lg text-gray-100">Endpoints</div>
                </div>
            </div>
            {/* </div> */}

        </div>
    );
};

export default LandingPage;
