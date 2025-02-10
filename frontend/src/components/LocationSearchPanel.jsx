import React from 'react'

const LocationSearchPanel = ({ suggestions, setPickup, setDestination, activeField }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
    }



    return (
        <div>
            {suggestions && suggestions.length === 0 && <h2 className='text-center text-gray-500'>No suggestions found</h2>}

            {suggestions && suggestions.map((elem, idx) => (
                <div key={idx} onClick={() => handleSuggestionClick(elem)}
                    className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
                    <h2 className='bg-[#eee] h-10 flex items-center justify-center w-[15%] rounded-full'><i className="ri-map-pin-fill"></i></h2>
                    <h4 className='font-medium w-[85%]'>{elem}</h4>
                </div>
            ))}
        </div>
    )
}

export default LocationSearchPanel