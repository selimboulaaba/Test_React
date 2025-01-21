import { BookOpen, ChevronDown, Expand, Gamepad2, GraduationCap, LibraryBig, School } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import ClassProgress from '../../components/ClassProgress';
import classes from '../../data/courses.json'
import TopScorer from '../../components/TopScorer';
import users from '../../data/users.json'
import activities from '../../data/activities.json'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";
import UserClass from '../../components/UserClass';

function Statistiques() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const toggleFullScreen = () => {
        if (!isFullScreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        setIsFullScreen(!isFullScreen);
    };

    const getAcademicYear = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        if (month >= 8) {
            return `${year}-${year + 1}`;
        } else {
            return `${year - 1} - ${year}`;
        }
    }

    const [filterByYear, setFilterByYear] = useState(true)
    const [sortedStudents, setSortedStudents] = useState([])
    useEffect(() => {
        setSortedStudents([...users].sort((a, b) =>
            filterByYear
                ? b.progressThisYear - a.progressThisYear
                : b.level - a.level
        ))
    }, [filterByYear])

    const getDaysOfWeek = () => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        const days = Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(day.getDate() + i);
            return day.toLocaleDateString('en-GB');
        });
        return days;
    };

    const handleActivitiesByRangeOfDays = (list) => {
        const activityCount = activities.reduce((acc, activity) => {
            const day = activity.date;
            if (list.includes(day)) {
                acc[day] = (acc[day] || 0) + 1;
            }
            return acc;
        }, {});
        const result = Object.entries(activityCount).map(([day, count]) => {
            const dateObj = new Date(day.split('/').reverse().join('-'));
            const dayAbbreviation = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const maxValue = Math.max(...Object.values(activityCount));
            return {
                day: dayAbbreviation,
                count,
                opacity: count / maxValue
            };
        });
        setTotalActivities(result);
    }

    const [rangeOfDays, setRangeOfDays] = useState([])
    const [totalActivities, setTotalActivities] = useState([])
    const [selectedActivities, setSelectedActivities] = useState([])
    useEffect(() => {
        handleActivitiesByRangeOfDays(getDaysOfWeek())
        setSelectedActivities(activities)
    }, [])

    const [selectedDate, setSelectedDate] = useState([]);
    useEffect(() => {
        if (!selectedDate?.from && !selectedDate?.to) {
            setRangeOfDays(getDaysOfWeek())
            setSelectedActivities(activities)
        } else if (!selectedDate?.to) {
            const currentDate = (new Date(selectedDate.from)).toLocaleDateString("en-GB");
            setRangeOfDays([currentDate])

            const currentActivities = activities.filter(activity => activity.date === currentDate)
            setSelectedActivities(currentActivities)
        } else {
            const days = [];
            const currentDate = new Date(selectedDate.from);

            while (currentDate <= selectedDate.to) {
                days.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            let formattedDays = []
            days.map(day => {
                formattedDays.push(day.toLocaleDateString("en-GB"));
            })
            setRangeOfDays(formattedDays)

            const currentActivities = []
            formattedDays.map(day => {
                let tmpList = activities.filter(activity => activity.date === day)
                tmpList.map(tmpDay => currentActivities.push(tmpDay))
            })
            setSelectedActivities(currentActivities)
        }
    }, [selectedDate])

    useEffect(() => {
        handleActivitiesByRangeOfDays(rangeOfDays)
    }, [rangeOfDays])


    return (
        <div className='bg-white h-[calc(100vh-40px)] m-[20px] rounded-xl border-[#8D84F4] border-[3.47px] font-fredoka'>
            <div className='flex items-center justify-between mx-12 my-9'>
                <span className='text-4xl font-medium text-[#4C4949]'>Statistiques</span>
                <div className='flex items-center gap-6'>
                    <div className='flex items-center border-2 border-[#8D84F4] rounded-xl px-3 py-2 bg-[#F4F4F6] hover:bg-[#d8d8da] hover:cursor-pointer'>
                        <span className='text-[#5B5B5B] text-lg'>Niveau Scolaire</span>
                        <ChevronDown color='#584DE2' />
                    </div>
                    <button
                        onClick={toggleFullScreen}
                        className={`transform transition-transform duration-300 ease-in-out 
        ${isFullScreen ? 'rotate-180 scale-110' : 'hover:scale-110'}`}
                    >
                        <Expand color="#8A83E4" height={40} width={40} />
                    </button>
                </div>
            </div>

            <div className='grid gap-3 grid-cols-12 grid-rows-12 bg-[#E8E7ED] border-[#584DE2] border-2 rounded-xl h-[80%] mx-12 p-8'>
                <div className='col-span-3 row-span-2 bg-white rounded-xl flex items-center'>
                    <div className="w-2 h-full bg-[#40E0D0] rounded-l-lg" />
                    <div className='flex items-center justify-between flex-grow px-16'>
                        <School color='#40E0D0' width={45} height={45} />
                        <div className="h-10 w-1 border-l-[3px] border-[#707070]" />
                        <div className='text-[#707070] font-medium'>
                            <div>Classes</div>
                            <div className='text-2xl'>{classes.length}</div>
                        </div>
                    </div>
                </div>
                <div className='col-span-4 row-span-2 bg-white rounded-xl flex items-center'>
                    <div className="w-2 h-full bg-[#FFA500] rounded-l-lg" />
                    <div className='flex items-center justify-between flex-grow pl-16 pr-6'>
                        <GraduationCap color='#FFA500' width={45} height={45} />
                        <div className="h-10 w-1 border-l-[3px] border-[#707070]" />
                        <div className='text-[#707070] font-medium'>
                            <div>Elèves</div>
                            <div className='text-2xl'>100</div>
                        </div>
                        <div className='px-4 py-2 flex flex-col border-2 border-[#FFC793] rounded-lg bg-[#ED8E36ED] text-[#FAEACC] text-right'>
                            Activité Totale
                            <span className='text-2xl'>45%</span>
                        </div>
                    </div>
                </div>
                <div className='col-span-5 row-span-2 bg-white rounded-xl flex items-center justify-between px-20 border-4 border-[#584DE2]'>
                    <div className='flex items-center'>
                        <BookOpen color='#584DE2' width={40} height={40} />
                        <span className='text-2xl text-[#707070] font-medium ml-4'>2</span>
                    </div>
                    <div className="h-10 w-1 border-l-[3px] border-[#584DE2]" />
                    <div className='flex items-center'>
                        <Gamepad2 color='#584DE2' width={40} height={40} />
                        <span className='text-2xl text-[#707070] font-medium ml-4'>2</span>
                    </div>
                    <div className="h-10 w-1 border-l-[3px] border-[#584DE2]" />
                    <div className='flex items-center'>
                        <LibraryBig color='#584DE2' width={40} height={40} />
                        <span className='text-2xl text-[#707070] font-medium ml-4'>4</span>
                    </div>
                </div>
                <div className='col-span-3 row-span-10 bg-white rounded-xl'>
                    <div className='text-[#525050] ml-6 mt-4 font-medium'>Progrès</div>
                    <div className='max-h-[90%] overflow-y-auto p-4 mr-4 mt-2 custom-scroll-classe'>
                        {classes.map((classe, index) => (
                            <ClassProgress classe={classe} key={index} />
                        ))}
                    </div>
                </div>
                <div className='col-span-4 row-span-10 bg-white rounded-xl grid grid-rows-2'>
                    <div className="row-span-1">
                        <div className='flex items-center justify-between mx-6 mt-4'>
                            <div className='text-[#4C4949] font-medium'>Calendrier d'activité</div>
                            <div
                                value={null} onChange={(e) => { }}
                                className="hover:cursor-pointer rounded-full text-sm px-3 py-1 focus:outline-none text-center border border-[#4C4949] bg-transparent text-[#4C4949] appearance-none pr-8 relative"
                                style={{
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'black\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\' clip-rule=\'evenodd\'/%3E%3C/svg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundSize: '1rem'
                                }}
                            >
                                {new Date().getFullYear()}
                            </div>
                        </div>
                        <DayPicker mode="range" min={1} max={6}
                            selected={selectedDate} onSelect={setSelectedDate}
                            classNames={{
                                today: `bg-[#F2C94C] text-black rounded-xl`,
                                selected: `bg-[#32CD32] text-white rounded-xl`,
                                range_start: '',
                                range_end: '',
                                chevron: `fill-white bg-[#584DE2] rounded-lg h-[20px] w-[50px]`,
                                month_caption: 'text-[#655BE1] font-medium text-center mb-3',
                                weekday: 'bg-[#695EFF] text-white rounded-xl h-[20px] text-xs font-thin',
                                day: 'w-5 h-5 text-sm pl-2',
                                months: 'w-full',
                            }}
                        />
                    </div>
                    <div className="row-span-1">
                        <div className="pt-4 h-full w-full bg-[#4A4585] text-white rounded-b-xl">
                            <div className="flex items-center justify-center gap-1">
                                <School width={35} height={35} />
                                <span className='font-medium text-2xl mr-5'>22</span>
                                <GraduationCap width={35} height={35} />
                                <span className='font-medium text-2xl'>22</span>
                            </div>
                            <hr className='my-4 w-[50%] mx-auto border-2 opacity-20' />
                            <div className='max-h-[60%] overflow-y-auto px-4 mr-4 mt-2 custom-scroll-activity'>
                                {selectedActivities.map((activity, index) => (
                                    <UserClass activity={activity} key={index} />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
                <div className='col-span-5 row-span-5 bg-[#584DE2] rounded-xl'>
                    <div className='flex items-center justify-between mx-6 mt-4'>
                        <div className='text-white font-medium'>Activité Totale</div>
                        <div
                            className="hover:cursor-pointer rounded-full text-sm px-3 py-1 focus:outline-none text-center border border-white bg-transparent text-white appearance-none pr-8 relative"
                            style={{
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'white\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\' clip-rule=\'evenodd\'/%3E%3C/svg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.5rem center',
                                backgroundSize: '1rem'
                            }}
                        >
                            Cette Semaine
                        </div>
                    </div>
                    <ResponsiveContainer width="90%" height="85%" className="mx-auto">
                        <BarChart data={totalActivities}>
                            <XAxis dataKey="day" stroke="#FFFFFF" />
                            <Bar dataKey="count" fill="#FFFFFF" radius={[5, 5, 0, 0]} fillOpacity={(entry) => entry.opacity} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className='col-span-5 row-span-5 bg-[#5C54BD] rounded-xl'>
                    <div className='flex items-center justify-between mx-6 mt-4'>
                        <div className='text-white font-medium'>Top Scores</div>
                        <select
                            value={filterByYear} onChange={(e) => setFilterByYear(e.target.value === "true")}
                            className="hover:cursor-pointer rounded-full text-sm px-3 py-1 focus:outline-none text-center border border-white bg-transparent text-white appearance-none pr-8 relative"
                            style={{
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'white\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\' clip-rule=\'evenodd\'/%3E%3C/svg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.5rem center',
                                backgroundSize: '1rem'
                            }}
                        >
                            <option value={true} className='text-black'>{getAcademicYear()}</option>
                            <option value={false} className='text-black'>Level</option>
                        </select>
                    </div>
                    <div className='grid grid-cols-3 h-[75%] mt-2 gap-3 px-3'>
                        {sortedStudents.map((student, index) => (
                            <TopScorer user={student} rank={index} key={index} filterByYear={filterByYear} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistiques