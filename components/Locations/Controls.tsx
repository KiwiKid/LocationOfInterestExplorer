import React, { useState } from "react";
import { shortDayLongMonthToNZ, getDateInPastByXDays } from "../utils/utils";
import AddToHomeScreenButton from "../utils/AddToHomeScreenButton";
import Summary from '../utils/Summary'

type ControlsProps = {
    daysInPastShown: any
    changeDaysInPastShown: any
    locationCount: number
}
export default function Controls({
     daysInPastShown
    , changeDaysInPastShown
    , locationCount
}:ControlsProps){


    const dateAfter = getDateInPastByXDays(daysInPastShown);

    const noLocations = `No Locations of interest in the circle since ${shortDayLongMonthToNZ.format(dateAfter)} `;
   // const shortLocations = `${locationCount} locations in the Circle (showing since ${shortDayLongMonth.format(dateAfter)})`

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 pb-3 space-y-3" >
            <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="">
                    <ul className="list-disc pl-8 p-4">
                        <li>Click/Tap on any Locations of Interest on the map to view a summary</li>
                        <li>Click/Tap/Drag on the gray bar to show and hide this drawer</li>
                        <li>Click/Tap anything with ▼ or ▲ symbol to open or close</li>
                        <li>{`"Use my Location"`} button will center the map on your current location</li>
                        <li>All locations in the large blue circle will be listed in the drawer</li>
                    </ul>
                </div>
                <div className="">
                    <div className="pl-4 sm:p-8">
                        <div className="text-lg">Using the map</div>
                        <div className="pl-3">
                            <div>Mobile:</div>
                            <ul className="list-disc pl-8">
                                <li>Move the map by dragging with one finger</li>
                                <li>Zoom the map by pinching with two fingers, the +/- in the top right, or double tapping</li>
                            </ul>
                            <div>Desktop:</div>
                            <ul className="list-disc pl-8">
                                <li>Move the map by holding the left-click and dragging</li>
                                <li>Zoom the map using the mouse scroll or the +/- in the top right </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
              {/*  <div className="md:w-3/5 m-auto">
                    {/*<Summary>Use these options to control how this page behaves</Summary>* /}
                    <label htmlFor="dateSelection" className="col-span-3 sm:col-span-4 text-lg">
                            <div className="text-center">
                                <div>
                                    Only show locations:
                                </div>
                            </div>
                        </label>   
                    <select
                        value={daysInPastShown}
                        id="dateSelection"
                        onChange={(evt) => changeActiveLocationDate(+evt.target.value)} name="activeDateFilter" 
                        className="form-select text-center text-black block w-full h-12 border-blue-400 border-b-4 bg-blue-200 rounded-lg focus:shadow-outline hover:bg-blue-400">
                        {activeDateSelections.map((ads:ActiveDateSelection) => <option value={ads.days} key={ads.days}>In the last {ads.display} (since {shortDayLongMonth.format(getDateInPastByXDays(ads.days))})</option>)}
                    </select>
                </div>
            <div className="">
                <div className="m-auto md:w-3/5">
                    <label htmlFor="dateSelection" className="col-span-3 sm:col-span-4 text-lg">
                        <div className="text-center">
                            <div>
                                Add shortcut to app:
                            </div>
                        </div>
                    </label> 
                    <AddToHomeScreenButton />
                </div>
            </div>
            <div className="mt-3 w-full">
                <div className="m-auto md:w-2/5">
                    <div className="grid grid-cols-4 sm:grid-cols-6">
                        <div className="m-auto">
                            <input 
                                className="col-span-1 sm:col-span-2 w-8 h-8 text-green-100 transition-colors duration-150 bg-red-500 rounded-lg focus:shadow-outline hover:bg-red-400 disabled:bg-blue-500" 
                                type="checkbox"
                                name="saveLocally"
                                id="saveLocally"
                                onChange={() => toggleAllowLocationRestore(!allowLocationRestore)}
                                checked={allowLocationRestore}
                            />
                        </div>
                        <label htmlFor="saveLocally" className="col-span-3 sm:col-span-4 sm:text-lg">
                            <div className="text-left">
                                <div className="text-center">When reopening this page, return to this location</div>                                
                            </div>
                        </label>
                            {allowLocationRestore ? <div className="col-span-full text-center">(Your location is not stored in this system - just on your computer)</div> : null}
                    </div>
                </div>
            </div>*/}
        </div>
    );
}

