const fetchStatsButton = document.getElementById('fetchStats');
const usernameInput = document.getElementById('username');
const statsContainer = document.getElementById('statsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');

fetchStatsButton.addEventListener('click', fetchStats);

async function fetchStats() {
    let username = usernameInput.value;
    if (!username) {
        alert('Enter an username to proceed');
        return;
    };

    loadingIndicator.classList.remove('hidden');
    statsContainer.classList.add('hidden');

    try {
        const URL = `https://leetcode-api-faisalshohag.vercel.app/${username.trim()}`;
        const data = await fetch(URL);
        const response = await data.json();

        updateUI(response);
        usernameInput.value = '';
    } catch (error) {
        console.error('Error fetching stats:', error);
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

function updateUI(data) {
    statsContainer.classList.remove('hidden');
    setTimeout(() => {
        statsContainer.style.opacity = '1';
    }, 50);

    updateUserStats(data);
    createSolvedChart(data);
    createTotalChart(data);
    createProgressChart(data);
    createComparisonChart(data);
}

function updateUserStats(data) {
    const userStatsContainer = document.getElementById('userStats');
    userStatsContainer.innerHTML = '';
    const stats = [
        { label: 'Ranking', value: data.ranking },
        { label: 'Reputation', value: data.reputation },
        { label: 'Contribution Points', value: data.contributionPoint }
    ];

    stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.className = 'flex flex-col items-center m-2 p-4 bg-white bg-opacity-20 rounded-lg';
        statElement.innerHTML = `
            <span class="text-2xl font-bold text-white">${stat.value}</span>
            <span class="text-sm text-gray-200">${stat.label}</span>
        `;
        userStatsContainer.appendChild(statElement);
    });
}

function createSolvedChart(data) {
    const options = {
        series: [data.easySolved, data.mediumSolved, data.hardSolved],
        chart: {
            type: 'donut',
            height: 350
        },
        labels: ['Easy', 'Medium', 'Hard'],
        colors: ['#4ade80', '#fbbf24', '#f87171'],
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Solved',
                            color: '#fff'
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#111']
            }
        },
        legend: {
            position: 'bottom',
            labels: {
                colors: '#fff'
            }
        }
    };

    const chart = new ApexCharts(document.querySelector("#solvedChart"), options);
    chart.render();
}

function createTotalChart(data) {
    const options = {
        series: [data.totalEasy, data.totalMedium, data.totalHard],
        chart: {
            type: 'pie',
            height: 350
        },
        labels: ['Easy', 'Medium', 'Hard'],
        colors: ['#60a5fa', '#818cf8', '#a78bfa'],
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#111']
            }
        },
        legend: {
            position: 'bottom',
            labels: {
                colors: '#fff'
            }
        }
    };

    const chart = new ApexCharts(document.querySelector("#totalChart"), options);
    chart.render();
}

function createProgressChart(data) {
    const options = {
        series: [{
            name: 'Progress',
            data: [
                (data.easySolved / data.totalEasy) * 100,
                (data.mediumSolved / data.totalMedium) * 100,
                (data.hardSolved / data.totalHard) * 100
            ]
        }],
        chart: {
            height: 350,
            type: 'radar'
        },
        xaxis: {
            categories: ['Easy', 'Medium', 'Hard'],
            labels: {
                style: {
                    colors: '#fff'
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function(val) {
                    return val.toFixed(0) + '%';
                },
                style: {
                    colors: '#fff'
                }
            }
        },
        fill: {
            opacity: 0.5,
            colors: ['#8b5cf6']
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['#8b5cf6'],
            dashArray: 0
        },
        markers: {
            size: 5,
            colors: ['#8b5cf6'],
            strokeColor: '#fff',
            strokeWidth: 2,
        }
    };

    const chart = new ApexCharts(document.querySelector("#progressChart"), options);
    chart.render();
}

function createComparisonChart(data) {
    const options = {
        series: [{
            name: 'Solved',
            data: [data.easySolved, data.mediumSolved, data.hardSolved]
        }, {
            name: 'Total',
            data: [data.totalEasy, data.totalMedium, data.totalHard]
        }],
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Easy', 'Medium', 'Hard'],
            labels: {
                style: {
                    colors: '#fff'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Number of Questions',
                style: {
                    color: '#fff'
                }
            },
            labels: {
                style: {
                    colors: '#fff'
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " questions"
                }
            }
        },
        legend: {
            position: 'top',
            labels: {
                colors: '#fff'
            }
        },
        colors: ['#60a5fa', '#f472b6']
    };

    const chart = new ApexCharts(document.querySelector("#comparisonChart"), options);
    chart.render();
}