export function moonphaseSwitcher(moonPhase, moon, illumination) {
    switch(moonPhase){
        case("New Moon"):
        $(".astro-main").html(`<img class="moon-phase" src="${moon.phase1.img}">`)
        $(".illumination").html(`<p> ${illumination}%</p>`)
        $(".astro-low-bar").html(`<p>${moon.phase1.name} <span>${moonPhase}</span></p>`)
        $(".moonphase-desc").html(`${moon.phase1.desc} <span>${moon.link}</span>`)
        break;
        case("Waxing Crescent"):
        $(".astro-main").html(`<img class="moon-phase" src="${moon.phase2.img}">`)
        $(".illumination").html(`<p> ${illumination}%</p>`)
        $(".astro-low-bar").html(`<p>${moon.phase2.name} <span>${moonPhase}</span></p>`)
        $(".moonphase-desc").html(`${moon.phase2.desc} <span>${moon.link}</span>`)
        break;
        case("First Quarter"):
        $(".astro-main").html(`<img class="moon-phase" src="${moon.phase3.img}">`)
        $(".illumination").html(`<p> ${illumination}%</p>`)
        $(".astro-low-bar").html(`<p>${moon.phase3.name} <span>${moonPhase}</span></p>`)
        $(".moonphase-desc").html(`${moon.phase3.desc} <span>${moon.link}</span>`)
        break;
        case("Waxing Gibbous"):
        $(".astro-main").html(`<img class="moon-phase" src="${moon.phase4.img}">`)
        $(".illumination").html(`<p> ${illumination}%</p>`)
        $(".astro-low-bar").html(`<p>${moon.phase4.name} <span>${moonPhase}</span></p>`)
        $(".moonphase-desc").html(`${moon.phase4.desc} <span>${moon.link}</span>`)
        break;
        case("Full Moon"):
        $(".astro-main").html(`<img class="moon-phase" src="${moon.phase5.img}`)
        $(".illumination").html(`<p> ${illumination}%</p>`)
        $(".astro-low-bar").html(`<p>${moon.phase5.name} <span>${moonPhase}</span></p>`)
        $(".moonphase-desc").html(`${moon.phase5.desc} <span>${moon.link}</span>`)
        break;
        case("Waning Gibbous"):
        $(".astro-main").html(`<img class="moon-phase" src="${moon.phase6.img}">`)
        $(".illumination").html(`<p> ${illumination}%</p>`)
        $(".astro-low-bar").html(`<p>${moon.phase6.name} <span>${moonPhase}</span></p>`)
        $(".moonphase-desc").html(`${moon.phase6.desc} <span>${moon.link}</span>`)
        break;
        case("Last Quarter"):
        $(".astro-main").html(`<img class="moon-phase" src="${moon.phase7.img}">`)
        $(".illumination").html(`<p> ${illumination}%</p>`)
        $(".astro-low-bar").html(`<p>${moon.phase7.name} <span>${moonPhase}</span></p>`)
        $(".moonphase-desc").html(`${moon.phase7.desc} <span>${moon.link}</span>`)
        break;
        case("Waning Crescent"):
        $(".astro-main").html(`<img class="moon-phase" src="${moon.phase8.img}">`)
        $(".illumination").html(`<p> ${illumination}%</p>`)
        $(".astro-low-bar").html(`<p>${moon.phase8.name} <span>${moonPhase}</span></p>`)
        $(".moonphase-desc").html(`${moon.phase8.desc} <span>${moon.link}</span>`)
        break;
      }
}