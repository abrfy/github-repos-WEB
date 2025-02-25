const beeModel = document.getElementById("bee-model");
const sections = Array.from(document.querySelectorAll("section"));

const getShiftPositions = () => {
    if (window.innerWidth <= 768) {
        return [0, -10, 0, 15];
    } else if (window.innerWidth <= 1024) {
        return [0, -15, 0, 20]; 
    }
    return [0, -20, 0, 25]; 
};

let shiftPositions = getShiftPositions();
const cameraOrbit = [[90,90], [-45,90], [-180,0], [45,90]];

const sectionOffsets = sections.map(section => section.offsetTop);
const lastSectionIndex = sections.length - 1;
const interpolate = (start, end, progress) => start + (end - start) * progress;

const getScrollProgress = scrollY => {
    for (let i = 0; i < lastSectionIndex; i++) {
        if (scrollY >= sectionOffsets[i] && scrollY < sectionOffsets[i + 1]) {
            return i + (scrollY - sectionOffsets[i]) / (sectionOffsets[i + 1] - sectionOffsets[i]);
        }
    }
    return lastSectionIndex;
};

const updateBeePosition = () => {
    const scrollProgress = getScrollProgress(window.scrollY);
    const sectionIndex = Math.floor(scrollProgress);
    const sectionProgress = scrollProgress - sectionIndex;

    const currentShift = interpolate(
        shiftPositions[sectionIndex], 
        shiftPositions[sectionIndex + 1] ?? shiftPositions[sectionIndex], 
        sectionProgress
    );

    const currentOrbit = cameraOrbit[sectionIndex].map((val, i) =>
        interpolate(val, cameraOrbit[sectionIndex + 1]?.[i] ?? val, sectionProgress)
    );

    beeModel.style.transform = `translateX(${currentShift}%)`;
    beeModel.setAttribute("camera-orbit", `${currentOrbit[0]}deg ${currentOrbit[1]}deg`);
};

let ticking = false;
window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateBeePosition();
            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener('resize', () => {
    shiftPositions = getShiftPositions();
    
    sections.forEach((section, index) => {
        sectionOffsets[index] = section.offsetTop;
    });
    
    updateBeePosition();
});

updateBeePosition();
