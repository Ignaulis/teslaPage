const topBar = document.querySelector('#top-bar');
const exteriorColorSection = document.querySelector('#exterior-buttons');
const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');
const interiorImage = document.querySelector('#interior-image');
const wheelButtonsSection = document.querySelector('#wheel-buttons');
const performanceBtn = document.querySelector('#performance-btn');
const totalPriceElement = document.querySelector('#total-price');
const fullSelfDrivingCheckBox = document.querySelector('#full-self-driving-checkbox');
const accessoryCheckbox = document.querySelectorAll('.accessory-form-checkbox');
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = 'Stealth Grey';
const selectedOptions = {
    'Performance Wheels': false,
    'Performance Package': false,
    'Full Self-Driving': false,
};

const pricing = {
    'Performance Wheels': 2500,
    'Performance Package': 5000,
    'Full Self-Driving': 8500,
    'Accessories': {
        'Center Console Trays': 35,
        'Sunshade': 105,
        'All-Weather Interior Liners': 225
    }
};

//update total price
const updateTotalPrice = () => {
    //reset current price to base price
    currentPrice = basePrice;

    if(selectedOptions['Performance Wheels']) {
        currentPrice += pricing['Performance Wheels'];
    }
    if(selectedOptions['Performance Package']) {
        currentPrice += pricing['Performance Package'];
    }
    if(selectedOptions['Full Self-Driving']) {
        currentPrice += pricing['Full Self-Driving'];
    }

    accessoryCheckbox.forEach((checkbox) => {
        const accessoryLabel = checkbox
            .closest('label')
            .querySelector('span')
            .textContent.trim();

        const accessoryPrice = pricing['Accessories'][accessoryLabel];

        // add two current if accessory is selected
        if(checkbox.checked) {
            currentPrice += accessoryPrice;
        }
    })

    // update total price
    totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;

    updatePaymentBreakdown();
};

// update payment breakdown based on current price
const updatePaymentBreakdown = () => {
    // calculate payment
    const downPayment = currentPrice * 0.1;
    downPaymentElement.textContent = `${downPayment.toLocaleString()}`;

    //calculate loan details
    const loanMonths = 60;
    const intrestRate = 0.03;
    const loanAmount = currentPrice - downPayment;

    // Monthly payment formula: P * (r(1+r)^n) / ((1+r)^n - 1)
    const monthlyIntrestRate = intrestRate / 12;
    const monthlyPayment = (loanAmount * (monthlyIntrestRate * Math.pow(1 + monthlyIntrestRate, loanMonths))) / (Math.pow(1 + monthlyIntrestRate, loanMonths) - 1);

    monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2).toLocaleString()}`;
}


// handle top bar scroll
const handleScroll = () => {
    const atTop = window.scrollY === 0;
    topBar.classList.toggle('visible-bar', atTop);
    topBar.classList.toggle('hidden-bar', !atTop);
};



// Image mapping
const exteriorImages = {
    'Stealth Grey': './images/model-y-stealth-grey.jpg',
    'Pearl White': './images/model-y-pearl-white.jpg',
    'Deep Blue': './images/model-y-deep-blue-metallic.jpg',
    'Solid Black': './images/model-y-solid-black.jpg',
    'Ultra Red': './images/model-y-ultra-red.jpg',
    'Quicksilver': './images/model-y-quicksilver.jpg',
  };
  
  const interiorImages = {
    Dark: './images/model-y-interior-dark.jpg',
    Light: './images/model-y-interior-light.jpg',
  };


// handle color selection
const handleColorButtonClick = (e) => {
    let button;

    if(e.target.tagName === 'IMG') {
        button = e.target.closest('button');
    } else if (e.target.tagName === 'BUTTON') {
        button = e.target
    }

    if(button) {
        const buttons = e.currentTarget.querySelectorAll('button');
        buttons.forEach((btn) => btn.classList.remove('btn-selected'));
        button.classList.add('btn-selected');


        // Change exterior image
        if(e.currentTarget === exteriorColorSection) {
            
            selectedColor = button.querySelector('img').alt;
            updateExteriorImage();
        }

        // Change interior image
        if(e.currentTarget === interiorColorSection) {

            const color = button.querySelector('img').alt;
            interiorImage.src = interiorImages[color];
        }
    }
    
};

//update exterior image
const updateExteriorImage = () => {
    const performanceSuffix = selectedOptions['Performance Wheels'] ? '-performance' : '';
    const colorKey = selectedColor in exteriorImages ? selectedColor : 'Stealth Grey';
    exteriorImage.src = exteriorImages[colorKey].replace('.jpg', `${performanceSuffix}.jpg`);
}

// wheel selection
const handleWheelButtonClick = (e) => {
    if(e.target.tagName === 'BUTTON') {
        const buttons = document.querySelectorAll('#wheel-buttons button');
        buttons.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));
        //add selected styles to clicked button
        e.target.classList.add('bg-gray-700', 'text-white');

        selectedOptions['Performance Wheels'] = e.target.textContent.includes('Performance');
        
        updateExteriorImage();
        updateTotalPrice();
    }
};

//performance package selection
const handlePerformanceButtonClick = () => {
    const isSelected = performanceBtn.classList.toggle('bg-gray-700');
    performanceBtn.classList.toggle('text-white');

    // update selected options
    selectedOptions['Performance Package'] = isSelected;

    updateTotalPrice();
};

//full self driving
const fullSelfDrivingChange = () => {
    selectedOptions['Full Self-Driving'] = fullSelfDrivingCheckBox.checked;
    updateTotalPrice();
};

// handle accessory checkbox listeners
accessoryCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', () => { updateTotalPrice()})
});

//initial update total price
updateTotalPrice();

// Events
window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener('click', handleColorButtonClick);
interiorColorSection.addEventListener('click', handleColorButtonClick);
wheelButtonsSection.addEventListener('click', handleWheelButtonClick);
performanceBtn.addEventListener('click', handlePerformanceButtonClick);
fullSelfDrivingCheckBox.addEventListener('change', fullSelfDrivingChange);
