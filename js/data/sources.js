/* SOURCE REGISTRY — every fact and every coefficient in the game points to an id here.
   org = the organisation or journal, so the app can show that data comes from many
   agencies and peer-reviewed journals (not one agency). */
(function (OT) {
  'use strict';
  OT.data.sources = {
    /* Space agencies (multi-agency) */
    esa_melissa:  { org: 'ESA', year: 2009, title: 'MELiSSA closed-loop life support project', url: 'https://www.esa.int/Our_Activities/Space_Engineering_Technology/MELiSSA_life_support_project_an_innovation_network_in_support_to_space_exploration' },
    esa_dust:     { org: 'ESA', year: 2018, title: 'The toxic side of the Moon (lunar dust)', url: 'https://www.esa.int/Our_Activities/Human_and_Robotic_Exploration/The_toxic_side_of_the_Moon' },
    esa_night:    { org: 'ESA', year: 2017, title: 'Surviving the long dark night of the Moon', url: 'https://www.esa.int/Enabling_Support/Space_Engineering_Technology/Surviving_the_long_dark_night_of_the_Moon' },
    esa_neliota:  { org: 'ESA / National Observatory of Athens', year: 2025, title: 'NELIOTA: lunar impact flashes', url: 'https://www.esa.int/Space_Safety/ESA_s_new_project_to_keep_an_eye_on_Moon_strikes' },
    esa_eva23:    { org: 'ESA', year: 2013, title: 'Spacewalks: water in Luca Parmitano\'s helmet', url: 'https://www.esa.int/ESA_Multimedia/Videos/2013/09/Spacewalks' },
    esa_ammonia:  { org: 'ESA', year: 2013, title: 'Spacewalk repairing ammonia leak', url: 'https://www.esa.int/ESA_Multimedia/Images/2013/05/Spacewalk_repairing_ammonia_leak' },
    csa_dcs:      { org: 'Canadian Space Agency', year: 2020, title: 'Decompression sickness and spacewalks', url: 'https://www.asc-csa.gc.ca/eng/astronauts/space-medicine/decomp.asp' },
    csa_tbone:    { org: 'Canadian Space Agency', year: 2022, title: 'TBone: effects of microgravity on astronauts\' bones', url: 'https://www.asc-csa.gc.ca/eng/sciences/tbone.asp' },
    cnsa_queqiao: { org: 'Chinese Academy of Sciences / CNSA', year: 2019, title: 'Relay satellite Queqiao for the lunar far side', url: 'https://english.cas.cn/newsroom/news/201901/t20190107_203642.shtml' },
    nasa_hazards: { org: 'NASA Human Research Program', year: 2024, title: 'The five hazards of human spaceflight', url: 'https://www.nasa.gov/hrp/hazards' },
    nasa_water:   { org: 'NASA (via phys.org)', year: 2023, title: 'ISS reaches 98% water recovery', url: 'https://phys.org/news/2023-06-nasa-recovery-milestone-international-space.html' },
    mir_fire:     { org: 'NASA APPEL Knowledge Services', year: 2011, title: 'International life support: the 1997 Mir oxygen-candle fire', url: 'https://appel.nasa.gov/wp-content/uploads/2013/04/602090main_44s_international_life_support.pdf' },

    /* Space weather */
    noaa_sscale:  { org: 'NOAA SWPC (via UNDRR)', year: 2020, title: 'Solar radiation storm scale S1–S5', url: 'https://undrr.org/quick/78528' },
    noaa_starlink:{ org: 'NOAA / AGU Space Weather', year: 2022, title: 'Space weather during the Starlink loss (Feb 2022)', url: 'https://repository.library.noaa.gov/view/noaa/53091/noaa_53091_DS1.pdf' },
    stce_dose:    { org: 'Solar-Terrestrial Centre of Excellence (Belgium)', year: 2025, title: 'Radiation dose of ISS astronauts', url: 'https://stce.be/news/756/welcome.html' },
    springer_rad: { org: 'Springer (Handbook of Space Medicine)', year: 2019, title: 'Space radiation dose rates: ISS, Mars, deep space', url: 'https://link.springer.com/10.1007/978-3-030-16996-1_20' },
    change4_rad:  { org: 'Science Advances (Zhang et al.)', year: 2020, title: 'First radiation dose measurements on the lunar surface (Chang\'e 4)', url: 'https://www.sci.news/space/radiation-dose-rates-lunar-surface-08893.html' },

    /* Operations history */
    soyuz_leak:   { org: 'Spaceflight Now', year: 2018, title: 'Cosmonauts plug a 2 mm air leak (Soyuz MS-09)', url: 'https://spaceflightnow.com/2018/08/30/cosmonauts-plug-small-air-leak-on-the-international-space-station/' },
    asat_2021:    { org: 'SpacePolicyOnline', year: 2021, title: 'ASAT debris forces ISS crew to shelter', url: 'https://spacepolicyonline.com/news/russian-asat-test-creates-thousands-of-pieces-of-space-debris-imperils-iss' },
    cargo_2015:   { org: 'SpacePolicyOnline', year: 2015, title: 'Three cargo ships lost in 8 months', url: 'https://spacepolicyonline.com/news/iss-operations-ok-despite-cargo-losses-but-whats-the-future/' },
    zinnia_mold:  { org: 'ScienceDaily (NASA Goddard)', year: 2016, title: 'Mold on space-station zinnias', url: 'https://www.sciencedaily.com/releases/2016/01/160119143038.htm' },
    lunar_soil:   { org: 'Communications Biology (Paul et al.)', year: 2022, title: 'Plants grown in Apollo lunar regolith', url: 'https://www.sci.news/space/lunar-soil-plants-10803.html' },
    mars500:      { org: 'PNAS (Basner et al.)', year: 2013, title: 'Mars-520 simulation: hypokinesis and sleep changes', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3574912' },

    /* Peer-reviewed space medicine */
    law_co2:      { org: 'J. Occupational & Environmental Medicine (Law et al.)', year: 2014, title: 'CO2 levels and headaches on the ISS', url: 'https://aminer.org/pub/55a6638365ce054aad65f738/relationship-between-carbon-dioxide-levels-and-reported-headaches-on-the-international-space' },
    nejm_dvt:     { org: 'New England Journal of Medicine (Auñón-Chancellor et al.)', year: 2020, title: 'Venous thrombosis during spaceflight', url: 'https://www.eurekalert.org/news-releases/824124' },
    jama_ijv:     { org: 'JAMA Network Open (Marshall-Goebel et al.)', year: 2019, title: 'Jugular venous flow stasis and thrombosis in spaceflight', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6902784' },
    ijgm_symptoms:{ org: 'Int. J. General Medicine (Crucian et al.)', year: 2016, title: 'Clinical symptoms during long-duration orbital flight', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5098747' },
    lancet_sleep: { org: 'The Lancet Neurology (Barger et al.)', year: 2014, title: 'Sleep deficiency and hypnotic use in astronauts', url: 'https://www.eurekalert.org/news-releases/541449' },
    jvr_sms:      { org: 'J. Vestibular Research (Jennings)', year: 1998, title: 'Managing space motion sickness', url: 'https://content.iospress.com:443/articles/journal-of-vestibular-research/ves8-1-10' },
    asem_back:    { org: 'Aviat. Space Environ. Med. (Kerstman et al.)', year: 2012, title: 'Space adaptation back pain', url: 'https://www.peeref.com/works/7344683' },
    npj_sans:     { org: 'npj Microgravity (Lee et al.)', year: 2020, title: 'Spaceflight associated neuro-ocular syndrome (SANS)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7005826/' },
    renal_stone:  { org: 'NASA Technical Reports (Whitson et al.)', year: 2000, title: 'Renal stone risk during spaceflight', url: 'https://ntrs.nasa.gov/citations/20000020539' },
    jbmr_bone:    { org: 'J. Bone and Mineral Research (Lang et al.)', year: 2004, title: 'Bone loss from spine and hip in long-duration flight', url: 'https://pubmed.ncbi.nlm.nih.gov/15125798/' },
    npj_risks:    { org: 'npj Microgravity (Patel et al.)', year: 2020, title: 'Red risks for a journey to the red planet', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7645687' },

    /* Learning science (used in the debrief & research mode) */
    sterman_stock:{ org: 'Org. Behavior & Human Decision Processes (Cronin, Gonzalez & Sterman)', year: 2009, title: 'Why don\'t well-educated adults understand accumulation?', url: 'https://mitmgmtfaculty.mit.edu/jsterman/whydontwelleducatedadultsunderstand/' },
    wouters_games:{ org: 'J. Educational Psychology (Wouters et al.)', year: 2013, title: 'Meta-analysis of serious games', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4748544' },

    /* Marker for numbers that are game-design choices, not measurements */
    design:       { org: 'Design assumption', year: 2026, title: 'Educational scaling chosen by the team and tested by Monte Carlo', url: '' }
  };
})(window.OT);
