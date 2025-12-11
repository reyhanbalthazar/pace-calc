import React, { useState, useEffect } from 'react';

const PaceCalculator = () => {
    const [mode, setMode] = useState('timeToPace');
    const [distance, setDistance] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [seconds, setSeconds] = useState('');
    const [paceMinutes, setPaceMinutes] = useState('');
    const [paceSeconds, setPaceSeconds] = useState('');
    const [result, setResult] = useState(null);
    const [unit, setUnit] = useState('km');

    // Helper: Convert time inputs to total seconds
    const getTotalSeconds = () => {
        return (parseInt(hours) || 0) * 3600 +
            (parseInt(minutes) || 0) * 60 +
            (parseInt(seconds) || 0);
    };

    // Helper: Convert pace inputs to seconds per unit
    const getPaceSeconds = () => {
        return (parseInt(paceMinutes) || 0) * 60 + (parseInt(paceSeconds) || 0);
    };

    // Calculate based on current mode
    const calculateResult = () => {
        switch (mode) {
            case 'timeToPace':
                const dist1 = parseFloat(distance);
                const totalSec1 = getTotalSeconds();
                if (dist1 > 0 && totalSec1 > 0) {
                    const paceSecPerUnit = totalSec1 / dist1;
                    return {
                        type: 'pace',
                        value: {
                            minutes: Math.floor(paceSecPerUnit / 60),
                            seconds: Math.round(paceSecPerUnit % 60)
                        },
                        unit
                    };
                }
                break;

            case 'paceToTime':
                const dist2 = parseFloat(distance);
                const paceSec2 = getPaceSeconds();
                if (dist2 > 0 && paceSec2 > 0) {
                    const totalSec2 = dist2 * paceSec2;
                    return {
                        type: 'time',
                        value: {
                            hours: Math.floor(totalSec2 / 3600),
                            minutes: Math.floor((totalSec2 % 3600) / 60),
                            seconds: Math.round(totalSec2 % 60)
                        }
                    };
                }
                break;

            case 'paceAndTimeToDistance':
                const totalSec3 = getTotalSeconds();
                const paceSec3 = getPaceSeconds();
                if (totalSec3 > 0 && paceSec3 > 0) {
                    const distanceResult = totalSec3 / paceSec3;
                    return {
                        type: 'distance',
                        value: parseFloat(distanceResult.toFixed(2)),
                        unit
                    };
                }
                break;
        }
        return null;
    };

    // Real-time calculation on input change
    useEffect(() => {
        const newResult = calculateResult();
        setResult(newResult);
    }, [distance, hours, minutes, seconds, paceMinutes, paceSeconds, mode, unit]);

    // Clear all inputs
    const handleClear = () => {
        setDistance('');
        setHours('');
        setMinutes('');
        setSeconds('');
        setPaceMinutes('');
        setPaceSeconds('');
        setResult(null);
    };

    // Format time display
    const formatTime = (hours, minutes, seconds) => {
        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0 || (hours === 0 && minutes === 0)) {
            parts.push(`${seconds}s`);
        }
        return parts.join(' ') || '0s';
    };

    // Get mode description
    const getModeDescription = () => {
        const descriptions = {
            'timeToPace': 'Enter distance and finish time',
            'paceToTime': 'Enter distance and target pace',
            'paceAndTimeToDistance': 'Enter pace and duration'
        };
        return descriptions[mode];
    };

    // Check if inputs are valid for current mode
    const hasValidInputs = () => {
        switch (mode) {
            case 'timeToPace':
                return distance && (hours || minutes || seconds);
            case 'paceToTime':
                return distance && paceMinutes;
            case 'paceAndTimeToDistance':
                return (hours || minutes || seconds) && paceMinutes;
            default:
                return false;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Running Pace Calculator
            </h1>

            {/* Mode Selector */}
            <div className="flex flex-col items-center mb-8">
                <div className="inline-flex rounded-lg shadow-md mb-4">
                    {['timeToPace', 'paceToTime', 'paceAndTimeToDistance'].map((m, idx) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${mode === m
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } ${idx === 0 ? 'rounded-l-lg' :
                                    idx === 2 ? 'rounded-r-lg' : ''
                                }`}
                        >
                            {m === 'timeToPace' ? 'Time → Pace' :
                                m === 'paceToTime' ? 'Pace → Time' : 'Pace → Distance'}
                        </button>
                    ))}
                </div>

                <div className="text-center text-gray-600 text-sm">
                    <p>{getModeDescription()} to get instant results</p>
                </div>
            </div>

            {/* Unit Toggle */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm border">
                    <span className={`font-medium ${unit === 'km' ? 'text-blue-600' : 'text-gray-500'}`}>
                        Kilometers
                    </span>
                    <button
                        onClick={() => setUnit(unit === 'km' ? 'mile' : 'km')}
                        className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-300 transition-colors hover:bg-gray-400"
                    >
                        <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${unit === 'mile' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                    <span className={`font-medium ${unit === 'mile' ? 'text-blue-600' : 'text-gray-500'}`}>
                        Miles
                    </span>
                </div>
            </div>

            {/* Calculator Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                {/* Mode-specific inputs */}
                {(mode === 'timeToPace' || mode === 'paceToTime') && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Distance ({unit})
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                min="0.1"
                                step="0.1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                placeholder={`e.g., ${unit === 'km' ? '10.0' : '6.2'} for a ${unit === 'km' ? '10K' : '10K in miles'}`}
                            />
                            <div className="absolute right-3 top-3 text-gray-500 font-medium">
                                {unit}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Tip: Common distances - {unit === 'km' ? '5K (5), 10K (10), Half (21.1), Full (42.2)' : '5K (3.1), 10K (6.2), Half (13.1), Full (26.2)'}
                        </p>
                    </div>
                )}

                {/* Time inputs (for Time→Pace and Pace→Distance modes) */}
                {(mode === 'timeToPace' || mode === 'paceAndTimeToDistance') && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {mode === 'timeToPace' ? 'Finish Time' : 'Duration'}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Hours</label>
                                <input
                                    type="number"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                                <input
                                    type="number"
                                    value={minutes}
                                    onChange={(e) => setMinutes(e.target.value)}
                                    min="0"
                                    max="59"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Seconds</label>
                                <input
                                    type="number"
                                    value={seconds}
                                    onChange={(e) => setSeconds(e.target.value)}
                                    min="0"
                                    max="59"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Pace inputs (for Pace→Time and Pace→Distance modes) */}
                {(mode === 'paceToTime' || mode === 'paceAndTimeToDistance') && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pace per {unit}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                                <input
                                    type="number"
                                    value={paceMinutes}
                                    onChange={(e) => setPaceMinutes(e.target.value)}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Seconds</label>
                                <input
                                    type="number"
                                    value={paceSeconds}
                                    onChange={(e) => setPaceSeconds(e.target.value)}
                                    min="0"
                                    max="59"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Example: 5:30 = 5 minutes 30 seconds per {unit}
                        </p>
                    </div>
                )}

                {/* Status indicator */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                        {hasValidInputs() ? (
                            <>
                                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm text-green-600">Calculating...</span>
                            </>
                        ) : (
                            <>
                                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                <span className="text-sm text-gray-500">Enter values above</span>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {/* Results Display - Only show when we have valid inputs */}
            {result && hasValidInputs() && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 mb-8 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Result</h2>
                        <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            {mode === 'timeToPace' ? 'Pace Required' :
                                mode === 'paceToTime' ? 'Finish Time' : 'Distance Covered'}
                        </span>
                    </div>

                    {result.type === 'pace' && (
                        <div className="text-center">
                            <div className="text-5xl font-bold text-blue-600 mb-2">
                                {result.value.minutes}:{result.value.seconds.toString().padStart(2, '0')}
                            </div>
                            <p className="text-gray-600 mb-4">per {unit}</p>

                            <div className="inline-flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                                <span className="text-gray-500 mr-2">Speed:</span>
                                <span className="font-medium">
                                    {((unit === 'km' ? 1.60934 : 1) /
                                        (result.value.minutes + result.value.seconds / 60)).toFixed(2)}
                                    {unit === 'km' ? ' mph' : ' km/h'}
                                </span>
                            </div>
                        </div>
                    )}

                    {result.type === 'time' && (
                        <div className="text-center">
                            <div className="text-5xl font-bold text-green-600 mb-2">
                                {formatTime(result.value.hours, result.value.minutes, result.value.seconds)}
                            </div>
                            <p className="text-gray-600 mb-4">for {distance} {unit}</p>

                            {result.value.hours >= 1 && (
                                <div className="inline-flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                                    <span className="text-gray-500 mr-2">That's:</span>
                                    <span className="font-medium">
                                        {result.value.hours} hour{result.value.hours !== 1 ? 's' : ''} of running
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {result.type === 'distance' && (
                        <div className="text-center">
                            <div className="text-5xl font-bold text-purple-600 mb-2">
                                {result.value} {unit}
                            </div>
                            <p className="text-gray-600 mb-4">
                                at {paceMinutes || 0}:{paceSeconds.toString().padStart(2, '0')} per {unit}
                            </p>

                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Race distance comparison:</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {[
                                        { name: '5K', distance: unit === 'km' ? 5 : 3.11 },
                                        { name: '10K', distance: unit === 'km' ? 10 : 6.21 },
                                        { name: 'Half', distance: unit === 'km' ? 21.1 : 13.1 },
                                        { name: 'Full', distance: unit === 'km' ? 42.2 : 26.2 }
                                    ].map((race) => (
                                        <div
                                            key={race.name}
                                            className={`p-3 rounded-lg text-center ${result.value >= race.distance
                                                ? 'bg-green-100 border border-green-200'
                                                : 'bg-gray-100'
                                                }`}
                                        >
                                            <div className="text-xs text-gray-500">{race.name}</div>
                                            <div className={`font-medium ${result.value >= race.distance ? 'text-green-700' : 'text-gray-700'
                                                }`}>
                                                {result.value >= race.distance ? (
                                                    <span className="flex items-center justify-center">
                                                        <span className="mr-1">✓</span> Complete
                                                    </span>
                                                ) : (
                                                    <span>−{(race.distance - result.value).toFixed(1)} {unit}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Examples Section */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3">💡 Quick Examples to Try:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                        onClick={() => {
                            setMode('timeToPace');
                            setDistance('10');
                            setHours('');
                            setMinutes('50');
                            setSeconds('');
                            setUnit('km');
                        }}
                        className="text-left p-3 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                    >
                        <div className="text-sm text-blue-600 font-medium">10K in 50:00</div>
                        <div className="text-xs text-gray-500">What pace per km?</div>
                    </button>

                    <button
                        onClick={() => {
                            setMode('paceToTime');
                            setDistance('21.1');
                            setPaceMinutes('5');
                            setPaceSeconds('30');
                            setUnit('km');
                        }}
                        className="text-left p-3 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                    >
                        <div className="text-sm text-green-600 font-medium">5:30/km for Half</div>
                        <div className="text-xs text-gray-500">Finish time?</div>
                    </button>

                    <button
                        onClick={() => {
                            setMode('paceAndTimeToDistance');
                            setHours('');
                            setMinutes('30');
                            setSeconds('');
                            setPaceMinutes('6');
                            setPaceSeconds('0');
                            setUnit('km');
                        }}
                        className="text-left p-3 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                    >
                        <div className="text-sm text-purple-600 font-medium">6:00/km for 30min</div>
                        <div className="text-xs text-gray-500">How far?</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaceCalculator;