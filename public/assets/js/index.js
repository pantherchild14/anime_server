//Sales Chart
var options = {
	chart: {
		height: 308,
		type: "line",
		stacked: false,
        fontFamily: 'poppins, sans-serif',
	},
	dataLabels: {
		enabled: false
	},
	colors: ['000','000', '#F9F871'],
	series: [{
		name: 'Active Orders',
		type: 'column',
		data: [104, 102, 117, 146, 118, 115, 220, 103, 83, 114, 265, 174],
	}, {
		name: "Completed Orders",
		type: "column",
		data: [92, 75, 123, 111, 196, 122, 159, 102, 138, 136, 62, 240]
	}, {
		name: 'Sales Revenue',
		type: 'line',
		data: [35, 52, 86, 65, 102, 70, 152, 87, 55, 92, 170, 80],
	}],
	stroke: {
		width: [0, 0, 2]
	},
	plotOptions: {
		bar: {
			columnWidth: '25%',
		}
	},
	markers: {
		size: [0, 0, 3],
		colors: undefined,
		strokeColors: "#000",
		strokeOpacity: 0.6,
		strokeDashArray: 0,
		fillOpacity: 1,
		discrete: [],
		shape: "circle",
		radius: [0, 0, 2],
		offsetX: 0,
		offsetY: 0,
		onClick: undefined,
		onDblClick: undefined,
		showNullDataPoints: true,
		hover: {
			size: undefined,
			sizeOffset: 3
		}
	},
	fill: {
		opacity: [1, 1, 1]
	},
	grid: {
		borderColor: '#f2f6f7',
	},
	legend: {
		show: true,
		position: 'bottom',
		fontWeight: 500,
		markers: {
			width: 7,
			height: 7,
			shape: 'square',
			radius: 0,
		}
	},
	yaxis: {
		min: 0,
		forceNiceScale: true,
		title: {
			style: {
				color: '#adb5be',
				fontSize: '14px',
				fontFamily: 'poppins, sans-serif',
				fontWeight: 600,
				cssClass: 'apexcharts-yaxis-label',
			},
		},
		labels: {
			formatter: function (y) {
				return y.toFixed(0) + "";
			}
		}
	},
	xaxis: {
		type: 'month',
		categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		axisBorder: {
			show: true,
			color: 'rgba(119, 119, 142, 0.05)',
			offsetX: 0,
			offsetY: 0,
		},
		axisTicks: {
			show: true,
			borderType: 'solid',
			color: 'rgba(119, 119, 142, 0.05)',
			width: 6,
			offsetX: 0,
			offsetY: 0
		},
		labels: {
			rotate: -90
		}
	},
	tooltip: {
		enabled: true,
		shared: false,
		intersect: true,
		x: {
			show: false
		}
	},
};
var chart1 = new ApexCharts(document.querySelector("#salesChart"), options);
chart1.render();
function salesChart() {
	chart1.updateOptions({
		colors: [`rgb(${myVarVal})`,`rgba(${myVarVal}, 0.4)`, '#F9F871'],
	})
}

// total investment
var options = {
	series: [{
		name: 'Male',
		data: [80, 50, 57, 98, 66, 56, 75]
	}],
	chart: {
		toolbar: {
			show: false,
		},
		type: 'bar',
		height: 50,
		width: 95,
        fontFamily: 'poppins, sans-serif',
		sparkline: {
			enabled: true
		},
		dropShadow: {
			enabled: true,
			top: 0,
			left: 0,
			blur: 2,
			color: ['#fff'],
			opacity: 0.5
		}
	},
	colors: ['000'],
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '40%',
		},
	},
	grid: {
		show: false,
		borderColor: 'rgba(119, 119, 142, 0.07)',
	},
	dataLabels: {
		enabled: false
	},
	stroke: {
		show: true,
		width: 1,
		colors: ['transparent']
	},
	xaxis: {
		labels: {
			show: false,
		},
		categories: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],
		axisBorder: {
			show: false,
			color: 'rgba(119, 119, 142, 0.08)',
			offsetX: 0,
			offsetY: 0,
		},

		axisTicks: {
			show: false,
			borderType: 'solid',
			color: 'rgba(119, 119, 142, 0.08)',
			width: 6,
			offsetX: 0,
			offsetY: 0,
		},
	},
	yaxis: {
		title: {
			style: {
				color: '	#adb5be',
				fontSize: '14px',
				fontFamily: 'poppins, sans-serif',
				fontWeight: 600,
				cssClass: 'apexcharts-yaxis-label',
			},
		},
		labels: {
			show: false,
			formatter: function (y) {
				return y.toFixed(0) + "";
			}
		}
	},
	fill: {
		opacity: 1
	},
	legend: {
		show: false,
		position: "top"
	},
	tooltip: {
		y: {
			formatter: function (val) {
				return "$ " + val + " thousands"
			}
		}
	}
};
var chart2 = new ApexCharts(document.querySelector("#total-investment"), options);
chart2.render();
function totalInvestment() {
	chart2.updateOptions({
		colors: [`rgb(${myVarVal})`],
	})
}

$(function () {

	// Data Table
	$('#example1').DataTable({
		language: {
			searchPlaceholder: 'Search here...',
			sSearch: '',
			lengthMenu: '_MENU_',
		}
	});

	//______Select2 
	$('.select2').select2({
		minimumResultsForSearch: Infinity,
		width: "auto"
	});

});
