import React, { useState } from 'react';
import { Search, BookOpen, Clock, User, Calendar, X, Compass, ChevronRight, GraduationCap, Lock, HelpCircle } from 'lucide-react';

interface PhysicsPortalProps {
  onUnlockPolybackup: () => void;
}

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  difficulty: "Introductory" | "Intermediate" | "Advanced";
  snippet: string;
  fullBody: string[];
  keyTerms: string[];
  equations: string[];
  reviewQuestions: string[];
}

const ACADEMIC_ARTICLES: Article[] = [
  {
    id: "snells-law-refraction",
    title: "The Snell-Descartes Law: Wave Refraction at Planar Optical Boundaries",
    category: "Optics & Waves",
    author: "Dr. Arthur S. Vance",
    date: "June 10, 2026",
    readTime: "7 min read",
    difficulty: "Advanced",
    snippet: "Analyzing the transition behavior of electromagnetic radiation across transparent dielectrics. Decoupling wavelength propagation from frequency constants.",
    fullBody: [
      "Light behaves both as a wave and a particle depending on the physical context. When navigating homogeneous mediums, light rays pursue paths of stationary time, as dictated by Fermat's Principle of Least Time. However, when a wave encounter is established at a flat boundary between two materials—such as air and dense borosilicate glass—its propagation velocity undergoes an instantaneous modification.",
      "The degree of refraction, or bending, is governed by the refractive index (n) of each boundary material, defined as the ratio of the speed of light in a vacuum to the velocity of light within that specific medium (n = c/v). Because light slows down upon transitioning into an optically denser medium, the wave fronts crowd together, forcing a deviation in trajectory.",
      "The mathematical expression of this optical divergence is Snell's Law: n₁ · sin(θ₁) = n₂ · sin(θ₂), where the angle of incidence θ₁ and angle of refraction θ₂ are measured relative to the normal vector perpendicular to the boundary plane. This formula forms the bedrock of optical design, powering high-power microscope lenses, fiber-optic telecom lines, and astronomical refractive telescopes alike."
    ],
    keyTerms: ["Refractive Index", "Fermat's Principle", "Planar Boundary", "Optical Density"],
    equations: ["n = c / v", "n₁ · sin(θ₁) = n₂ · sin(θ₂)"],
    reviewQuestions: [
      "1. Why does the frequency of a light wave remain constant while its wavelength changes as it crosses into a denser medium?",
      "2. Calculate the angle of refraction if light strikes a water surface (n = 1.33) at an incident angle of 45° from air (n = 1.00)."
    ]
  },
  {
    id: "perfect-elastic-collisions",
    title: "Perfect Elastic Collisions: Momentum Coherence in Isolated Mechanical Systems",
    category: "Classical Mechanics",
    author: "Prof. Elena Rostova",
    date: "May 28, 2026",
    readTime: "9 min read",
    difficulty: "Advanced",
    snippet: "The kinetic consequences of linear elasticity. Deducing instantaneous post-impact velocities through simultaneous solutions of conservation equations.",
    fullBody: [
      "In classical mechanics, a collision represents a momentary mutual interaction between two or more physical bodies, resulting in a sudden and massive exchange of momentum and mechanical energy. In an isolated system, free of external forces such as friction, gravity, or ambient drag, the total momentum remains conserved. However, kinetic energy conservation depends entirely on the elasticity coefficient of the impact.",
      "A perfect elastic collision denotes an idealized physical benchmark where both Total Linear Momentum and Total Kinetic Energy are completely conserved across the collision event. No energy is lost to internal friction, thermal dissipation, acoustic vibrations, or structural plastic deformation.",
      "By solving the simultaneous equations of momentum conservation (m₁v₁ + m₂v₂ = m₁u₁ + m₂u₂) and kinetic energy conservation (½m₁v₁² + ½m₂v₂² = ½m₁u₁² + ½m₂u₂²), physicists can predict the exact mechanical state of bodies following impact. Under these conditions, the relative speed of approach before the event is precisely equal to the relative speed of separation after the event."
    ],
    keyTerms: ["Conservation of Momentum", "Elasticity Coefficient", "Kinetic Energy", "Dissipation Coefficient"],
    equations: ["∑ P_initial = ∑ P_final", "½m₁v₁² + ½m₂v₂² = conserved"],
    reviewQuestions: [
      "1. Under what real-world scenarios do elastic collisions naturally approximate perfection?",
      "2. Prove that the relative velocity of separation is equal to the negative relative velocity of approach in a one-dimensional elastic collision."
    ]
  },
  {
    id: "second-law-thermodynamics",
    title: "Entropy and Carnot Cycles: The Second Law of Thermodynamics",
    category: "Thermodynamics",
    author: "Markus Vance, PhD",
    date: "April 15, 2026",
    readTime: "8 min read",
    difficulty: "Advanced",
    snippet: "Decoupling thermal pathways. Why perpetual motion of the second kind remains physically impossible and how entropy dictates the arrow of time.",
    fullBody: [
      "While the First Law of Thermodynamics guarantees the absolute conservation of energy, it fails to specify the direction in which thermal processes can naturally occur. Why does heat only flow spontaneously from hot objects to cold ones, and never in reverse? The answer is formulated by the Second Law of Thermodynamics, which introduces the state function known as Entropy (S).",
      "Entropy serves as a quantitative measure of the thermodynamic molecular disorder or configuration probabilities within a closed environment. The Second Law asserts that the total entropy of an isolated system must always increase over time; it can never decrease spontaneously. Thus, any thermal reaction that occurs naturally is fundamentally irreversible.",
      "To analyze the optimal efficiency limits of converting heat into mechanical work, Nicolas Léonard Sadi Carnot proposed the theoretical Carnot Engine. Operating over a reversible, four-stage cycle (two isothermal steps and two adiabatic steps), the Carnot cycle yields the maximum efficiency permitted by physics: η = 1 - T_cold/T_hot. This efficiency is never 100%, as transferring a fraction of energy to a low-temperature sink is mandatory to keep entropy non-negative."
    ],
    keyTerms: ["Entropy (S)", "Carnot Cycle", "Adiabatic Expansion", "Thermal Irreversibility"],
    equations: ["ΔS_system + ΔS_surroundings ≥ 0", "η_max = 1 - (T_cold / T_hot)"],
    reviewQuestions: [
      "1. Discuss how the concept of entropy defines the cosmological 'arrow of time'.",
      "2. Calculate the maximum thermal efficiency of a coal-fired generator operating between 600 K and 300 K."
    ]
  },
  {
    id: "faradays-law-induction",
    title: "Faraday’s Law and Lorentz Forces: Magnetic Induction across Conductive Coils",
    category: "Electromagnetism",
    author: "Sandra Mitchell",
    date: "March 11, 2026",
    readTime: "6 min read",
    difficulty: "Intermediate",
    snippet: "Mapping flux density variations over time. Quantitative evaluations of induced electromotive forces in secondary wire assemblies.",
    fullBody: [
      "The discovery that dynamic magnetic fields could trigger electrical currents revolutionized early industrial engineering, paving the way for power grids. Michael Faraday demonstrated that when the magnetic flux passing through a closed loop of copper wire changes over time, an electromotive force (EMF) is actively induced within the conductor.",
      "Magnetic flux (Φ) is geometrically defined as the surface integral of the magnetic field vector B passing through the bounded area of the loop. If the magnetic flux fluctuates—either because the magnet is moving, the loop area is expanding, or the relative rotational angle is shifting—nature generates an electrical field inside the wire to counter the disturbance.",
      "Faraday's Law is mathematically expressed as EMF = -N(ΔΦ/Δt), where N is the number of winding turns. The critical negative sign represents Lenz's Law, confirming that the current induced by the EMF will project a secondary magnetic field that actively opposes the initial flux modification. This electromagnetic inertia is the foundation of power generators, induction cooktops, and transformers."
    ],
    keyTerms: ["Magnetic Flux (Φ)", "Electromotive Force (EMF)", "Lenz's Law", "Electromagnetic Inertia"],
    equations: ["Φ = B · A · cos(θ)", "EMF = -N · (dΦ / dt)"],
    reviewQuestions: [
      "1. Explain how Lenz's law represents the conservation of energy in electromagnetic induction.",
      "2. A coil of 150 turns is exposed to a changing magnetic flux at 0.05 Webers per second. What is the magnitude of the resulting induced EMF?"
    ]
  },
  {
    id: "double-slit-diffraction",
    title: "Double-Slit Diffraction: Defining Wave-Particle Duality in Quantum Mechanics",
    category: "Wave Mechanics",
    author: "Prof. David G. Thorne",
    date: "February 22, 2026",
    readTime: "8 min read",
    difficulty: "Advanced",
    snippet: "Revisiting Thomas Young's classic light coherence trials. Analyzing interference patterns created by discrete electron streams in vacuum fields.",
    fullBody: [
      "In 1801, Thomas Young performed his milestone double-slit experiment, demonstrating that light is a wave. When a single coherent light source is cast toward two narrow parallel slits, the light emerging from each slit projects a series of alternating bright and dark fringe bands on a target screen behind them.",
      "These patterns occur because the waves from each slit expand and overlap, interacting through constructive and destructive interference. Constructive interference occurs where the path difference between the two waves is an integer multiple of the wavelength (d · sin(θ) = mλ), producing a bright spot. Destructive interference occurs where the path differs by an odd half-wavelength, leaving a dark gap.",
      "The experiment took a mind-bending turn in the twentieth century when researchers repeated the trials using individual particles, such as electrons, loaded one at a time through the slits. Even when passing one by one, an interference pattern gradually constructed on the target collector. This verified that individual material particles propagate as probability waves, described by Erwin Schrödinger's wave equations, before collapsing into discrete particle points upon measurement feedback."
    ],
    keyTerms: ["Constructive Interference", "Wave-Particle Duality", "De Broglie Wavelength", "Probability Density"],
    equations: ["d · sin(θ) = m · λ", "λ = h / p"],
    reviewQuestions: [
      "1. What is the structural significance of observing interference patterns even when sending single electrons through the system?",
      "2. Calculate the wavelength of light that creates a third-order bright fringe at an angle of 15° through slits separated by 5 micrometers."
    ]
  },
  {
    id: "planetary-gravity-orbits",
    title: "Centripetal Forces and Keplerian Trajectories in Planetary Motion",
    category: "Orbital Mechanics",
    author: "Dr. Alistair Sterling",
    date: "January 14, 2026",
    readTime: "7 min read",
    difficulty: "Intermediate",
    snippet: "Deducing orbital stability through gravitational constant vector matching. Why Kepler’s third law is a direct mathematical consequence of Newton's gravity.",
    fullBody: [
      "An orbit is the gravitationally curved trajectory of an object around a massive celestial body. In our solar system, planets follow elliptic paths with the Sun occupying one of the two focuses, a rule known as Kepler's First Law. Though elliptic, many orbits are nearly circular and can be analyzed using Centripetal Acceleration equations.",
      "For a satellite or planet of mass (m) orbiting a central primary body of mass (M) at a radius (R), the gravitational pull of the primary body serves as the mandatory centripetal force holding the satellite in its path. Under Newton's Universal Law of Gravitation, this force is F_g = G·M·m/R².",
      "By setting the gravitational attraction equal to the required centripetal force (F_c = m·v²/R), we can establish the orbital speed: v = √(G·M/R). This proves that the orbital velocity is entirely independent of the orbiting object's mass. Squaring the orbital period relationships leads directly to Kepler's Third Law (T² ∝ R³), illustrating that larger orbital radii require exponentially longer travel times."
    ],
    keyTerms: ["Centripetal Acceleration", "Gravitational Constant (G)", "Kepler's Laws", "Elliptic Eccentricity"],
    equations: ["F_g = G · M · m / R²", "T² = (4π² / G·M) · R³"],
    reviewQuestions: [
      "1. Why does a satellite orbiting closer to the Earth travel faster than a satellite orbiting further out?",
      "2. Calculate the speed of a satellite orbiting Earth at an altitude of 500 km above the surface (Earth radius = 6371 km)."
    ]
  },
  {
    id: "special-relativity-dilation",
    title: "Special Relativity: Time Dilation and Lorentz Transformations",
    category: "Modern Physics",
    author: "Dr. Clara Hensley",
    date: "December 05, 2025",
    readTime: "9 min read",
    difficulty: "Advanced",
    snippet: "Exploring the constant nature of light speed across divergent frames. Solving chronological divergence using invariant interval equations.",
    fullBody: [
      "In 1905, Albert Einstein published his Special Theory of Relativity, upending the classical Newtonian foundations of absolute space and time. The theory rests on two core postulates: first, the laws of physics are identical in all inertial reference frames; second, the speed of light in a vacuum (c) is an absolute constant, regardless of the motion of the emitting source or observer.",
      "The constancy of light speed leads to highly counter-intuitive consequences when objects approach relativistic speeds (significant fractions of c). One consequence is Time Dilation, which reveals that a clock moving relative to an observer will tick slower than a clock at rest within that observer's reference frame.",
      "This temporal divergence is mathematically modeled by the Lorentz factor (γ): t = t₀ / √(1 - v²/c²). As velocity approaches c, the denominator approaches zero, causing the Lorentz factor to scale toward infinity. Consequently, a spaceship pilot traveling at high velocity would return home only to find that decades have elapsed on Earth, while they have aged only a few months."
    ],
    keyTerms: ["Relativistic Mechanics", "Lorentz Factor (γ)", "Inertial Reference Frame", "Time Dilation"],
    equations: ["γ = 1 / √(1 - v²/c²)", "t = γ · t₀"],
    reviewQuestions: [
      "1. Why is it impossible for any object with non-zero rest mass to reach the speed of light?",
      "2. If an astronaut travels at 0.8c for 5 years according to their ship calendar, how many years have passed on Earth?"
    ]
  },
  {
    id: "coulombs-law-fields",
    title: "Coulomb's Inverse-Square Law: Electrostatic Field Intensity in Free Space",
    category: "Electromagnetism",
    author: "Marcus Vance, PhD",
    date: "November 18, 2025",
    readTime: "6 min read",
    difficulty: "Introductory",
    snippet: "Examining scalar attraction and repulsion of point charges. Comparing electrostatic force constants to gravitational fields.",
    fullBody: [
      "Just as gravitational force governs massive stars and planets, electrostatic forces dictate the structural interactions of subatomic particles. Charles-Augustin de Coulomb quantified this interaction in 1785 by formulating the law of electrostatic attraction and repulsion.",
      "Coulomb's Law states that the scalar force (F) between two static, isolated point charges (q₁ and q₂) is directly proportional to the product of their charges, and inversely proportional to the square of the distance (r) separating their coordinates. The equation is F = k·|q₁·q₂|/r², where k is the electrostatic constant (approx. 8.99 × 10⁹ N·m²/C²).",
      "Because the force depends on the square of the separation distance, electrostatic fields diminish rapidly as charges move apart. However, unlike gravity—which is exclusively attractive—the electrostatic force can be highly repulsive if the participating charges possess identical signs, or highly attractive if the signs are opposites. This fundamental force holds atoms together in chemical bonds."
    ],
    keyTerms: ["Electrostatic Constant", "Coulomb's Law", "Point Charges", "Subatomic Bonding"],
    equations: ["F = k · |q₁ · q₂| / r²", "E = F / q"],
    reviewQuestions: [
      "1. Trace the primary mathematical similarities and physical differences between Newton's law of gravity and Coulomb's law of electrostatics.",
      "2. Two positive charges of 3µC and 5µC are separated by 0.1 meters. Calculate the electrostatic repulsive force."
    ]
  },
  {
    id: "frictional-coefficients-mechanics",
    title: "Frictional Coefficients: Mechanics of Static and Kinetic Surface Resistance",
    category: "Solid State Mechanics",
    author: "David G. Thorne",
    date: "October 03, 2025",
    readTime: "5 min read",
    difficulty: "Introductory",
    snippet: "Explaining dry Coulomb friction. Evaluating molecular interlocking forces between micro-irregular surfaces under variable normal forces.",
    fullBody: [
      "Friction is the resistant force opposing the relative sideways motion of solid surfaces in contact. This molecular resistance occurs because all real-world materials, no matter how polished they appear, feature microscopic ridges, gaps, and surface irregularities.",
      "When two surfaces slide past each other, these micro-irregularities collide and interlock, and temporary chemical adhesion bonds form between contact materials. The force required to overcome these localized bonds is directly proportional to the perpendicular load pressing the surfaces together—the Normal Force (F_N).",
      "We classify dry mechanical friction into two distinct phases: Static Friction (f_s), which resists the initiation of movement, and Kinetic Friction (f_k), which resists active sliding motion. The equations are defined by f_s ≤ µ_s·F_N and f_k = µ_k·F_N, where µ is the coefficient of friction. Because static interlocking is tighter, µ_s is almost always larger than µ_k."
    ],
    keyTerms: ["Normal Force (F_N)", "Coefficient of Friction (µ)", "Static Indentation", "Kinetic Resistance"],
    equations: ["f_s_max = µ_s · F_N", "f_k = µ_k · F_N"],
    reviewQuestions: [
      "1. Why is the static coefficient of friction between two materials generally greater than the kinetic coefficient?",
      "2. A wooden crate of mass 50 kg rests on an alpine floor (µ_s = 0.4). What horizontal force is required to initiate movement?"
    ]
  },
  {
    id: "nuclear-instability-kinetics",
    title: "Nuclear Instability and Half-Life Decay Kinetics",
    category: "Nuclear Physics",
    author: "Prof. Arthur S. Vance",
    date: "September 12, 2025",
    readTime: "8 min read",
    difficulty: "Intermediate",
    snippet: "Statistical modeling of radioactive alpha, beta, and gamma emissions. Defining exponential decay constants and nuclear isotopic half-lives.",
    fullBody: [
      "The nucleus of an atom is bound by the strong nuclear force, which must overcome the electromagnetic repulsion of closely packed protons. In unstable isotopes, the balance of forces is disrupted, triggering spontaneous nuclear transformations to reach a lower, more stable energy configuration.",
      "This process, known as Radioactive Decay, occurs randomly at the single-atom scale. However, because we deal with trillions of atoms in physical samples, we can model decay kinetics with extraordinary statistical accuracy. The rate of decay (A = -dN/dt) is always directly proportional to the total number of unstable nuclei (N) currently present.",
      "This direct proportionality yields the fundamental exponential decay law: N(t) = N₀ · e^(-λt), where λ is the decay constant. From this, we derive the 'half-life' (T_½), which is the absolute time required for exactly one-half of a sample's parent radionuclides to decay into daughter products: T_½ = ln(2) / λ. This decay clock provides the basis for archaeological carbon dating and radiotherapy calculations."
    ],
    keyTerms: ["Nuclear Isotope", "Radioactive Half-Life", "Decay Constant (λ)", "Exponential Decay"],
    equations: ["N(t) = N₀ · e^(-λt)", "T_½ = ln(2) / λ"],
    reviewQuestions: [
      "1. Define the relationship between the decay constant lambda and isotopic half-life.",
      "2. A sample of Uranium-235 is found to have decayed to 12.5% of its initial concentration. How many half-lives have elapsed?"
    ]
  },
  {
    id: "hookes-law-deformation",
    title: "Hooke’s Law: Elastic Deformation in Multi-Coiled Steel Springs",
    category: "Solid State Mechanics",
    author: "Dr. Sandra Mitchell",
    date: "August 20, 2025",
    readTime: "6 min read",
    difficulty: "Introductory",
    snippet: "Assessing shear modules, tension thresholds, and restoring force limits. Exploring the point of permanent mechanical failure.",
    fullBody: [
      "When a physical force acts on an elastic material, the material deforms. If the material returns to its original shape and volume once the force is removed, the deformation is classified as perfectly elastic. Robert Hooke discovered the proportionality governing these interactions in 1676.",
      "Hooke's Law states that within the elastic limit of an object, the mechanical displacement or stretch (x) has a direct linear relationship with the applied restoring force (F). The mathematical expression is F = -k·x, where k represents the spring constant, a measure of material stiffness (measured in Newtons per meter, N/m).",
      "The negative sign confirms that the spring's restoring force is directed in the opposite path of the physical displacement vector. However, if a spring is stretched beyond its 'elastic limit' or proportional boundary, it undergoes plastic deformation. At this threshold, the molecular grid shears irreversibly, and the spring remains permanently warped even after releasing the cargo."
    ],
    keyTerms: ["Restoring Force", "Spring Constant (k)", "Elastic Boundary", "Plastic Shear"],
    equations: ["F_spring = -k · x", "U_elastic = ½ · k · x²"],
    reviewQuestions: [
      "1. What is the physical sign significance of the negative sign in Hooke's Law?",
      "2. A spring with a stiffness constant of 250 N/m is compressed by 4 centimeters. Calculate the restoring force."
    ]
  }
];

export default function PhysicsPortal({ onUnlockPolybackup }: PhysicsPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  
  // Login State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Filter Categories
  const categories = ['All', 'Classical Mechanics', 'Optics & Waves', 'Thermodynamics', 'Electromagnetism', 'Wave Mechanics', 'Orbital Mechanics', 'Modern Physics', 'Solid State Mechanics', 'Nuclear Physics'];

  // Handle fake SSO Log-In process
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim().toLowerCase();

    // Check backdoor credentials
    if (cleanUser === 'john' && cleanPass === 'pork') {
      setLoginError(null);
      setIsLoginOpen(false);
      onUnlockPolybackup(); // Secret entrance into the real unblocked games portal!
    } else {
      // Academic looking rejection
      setLoginError('Authentication failed: Invalid credentials or expired school portal token.');
    }
  };

  // Filter Articles list
  const filteredArticles = ACADEMIC_ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || article.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDiff;
  });

  return (
    <div id="physics-portal-interactive" className="min-h-screen bg-[#FCFBF7] text-stone-900 font-sans antialiased selection:bg-amber-100 selection:text-stone-900">
      
      {/* Top Academic Header */}
      <header className="border-b border-stone-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0F2D59] rounded flex items-center justify-center font-serif text-white font-bold text-xl shadow-sm">
              P4S
            </div>
            <div>
              <h1 className="font-serif font-black text-xl tracking-tight text-[#0F2D59]">
                Physics<span className="text-[#8C1D40]">4</span>Students
              </h1>
              <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium">
                The Open-Access Peer-Reviewed Secondary Physics Encyclopedia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Library DB: Online (v4.12)</span>
            </div>
            
            <button
              onClick={() => {
                setLoginError(null);
                setUsername('');
                setPassword('');
                setIsLoginOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F2D59] hover:bg-[#1a447c] text-white rounded text-xs font-mono font-bold tracking-wide transition-colors cursor-pointer shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>SSO Portal Login</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Search Section & Welcome */}
      <section className="bg-stone-100 border-b border-stone-200 py-12 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#8C1D40]/10 text-[#8C1D40] text-xs font-mono tracking-widest uppercase font-semibold">
            <GraduationCap className="w-4 h-4" />
            Curriculum Support Materials
          </span>
          
          <h2 className="font-serif font-bold text-3xl sm:text-4.5xl text-stone-900 leading-tight">
            Curated Academic References & Study Lectures
          </h2>
          
          <p className="max-w-2xl mx-auto font-serif text-stone-605 text-sm sm:text-base leading-relaxed">
            Physics4Students delivers peer-reviewed derivations, formulas, definitions, and secondary school textbooks. 
            Students can browse articles or sign in with their district school credentials to access course logs.
          </p>

          {/* Large Editorial Search Bar */}
          <div className="max-w-2xl mx-auto relative mt-4 shadow-sm bg-white rounded-lg border border-stone-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0F2D59]/20 focus-within:border-[#0F2D59] transition-all">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search equations, mechanics concepts, refraction limits, Newton's calculations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 outline-none text-stone-800 text-sm font-sans"
            />
          </div>
        </div>
      </section>

      {/* Main Encyclopedia Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="border border-stone-200 rounded-lg bg-white p-5 space-y-4 shadow-sm">
              <h3 className="font-serif font-black text-md text-[#0F2D59] border-b border-stone-100 pb-2">
                Syllabus Categories
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer w-full flex items-center justify-between ${
                      selectedCategory === cat 
                        ? 'bg-[#8C1D40] text-white' 
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-stone-200 rounded-lg bg-white p-5 space-y-3 shadow-sm">
              <h3 className="font-serif font-black text-md text-[#0F2D59] border-b border-stone-100 pb-2">
                Degree Level
              </h3>
              <div className="flex flex-col gap-1">
                {['All', 'Introductory', 'Intermediate', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`text-left px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                      selectedDifficulty === diff 
                        ? 'bg-[#0F2D59] text-white font-bold' 
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Informational Box */}
            <div className="border border-amber-200/50 rounded-lg bg-amber-50/40 p-5 text-xs text-stone-600 space-y-2 leading-relaxed">
              <h4 className="font-bold text-[#8C1D40] uppercase font-mono tracking-wider">Academic Reference Bulletin</h4>
              <p>For credentials details, school-wide licenses, or print resources matching national physics standards, reach out to your local science department coordinator.</p>
            </div>
          </div>

          {/* Main Articles Stream */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-black text-lg text-stone-800">
                Peer-Reviewed Articles ({filteredArticles.length})
              </h3>
              <span className="text-xs text-stone-500 font-mono uppercase">
                // Classified References
              </span>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-white border border-stone-200 rounded-lg shadow-sm space-y-3">
                <p className="font-serif text-stone-500 italic">No academic articles match your specified query filter.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedDifficulty('All');
                  }}
                  className="px-4 py-1.5 bg-[#0F2D59] text-white hover:bg-stone-800 text-xs rounded transition-colors font-mono uppercase font-bold"
                >
                  Reset all query filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredArticles.map((article) => (
                  <article 
                    key={article.id}
                    className="bg-white border border-stone-200 hover:border-stone-300 rounded-lg p-6 sm:p-8 shadow-sm hover:shadow transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-stone-100 text-[#8C1D40] border border-stone-200">
                        {article.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        article.difficulty === 'Advanced' ? 'text-amber-700 bg-amber-50' :
                        article.difficulty === 'Intermediate' ? 'text-blue-700 bg-blue-50' : 'text-emerald-700 bg-emerald-50'
                      }`}>
                        {article.difficulty}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 
                        onClick={() => setActiveArticle(article)}
                        className="font-serif font-black text-xl sm:text-2xl text-stone-900 hover:text-[#0F2D59] transition-colors leading-tight cursor-pointer"
                      >
                        {article.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400 font-mono">
                        <span className="flex items-center gap-1 text-stone-600 font-bold">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          {article.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>

                    <p className="font-serif text-stone-600 text-sm leading-relaxed">
                      {article.snippet}
                    </p>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex gap-2">
                        {article.keyTerms.slice(0, 2).map(term => (
                          <span key={term} className="text-[10px] text-stone-400 font-mono">#{term}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => setActiveArticle(article)}
                        className="px-4 py-2 text-xs font-serif text-[#0F2D59] hover:text-[#8C1D40] font-black border border-stone-200 hover:border-[#8C1D40]/30 rounded bg-stone-50 hover:bg-white transition-all cursor-pointer"
                      >
                        Read Full Article &rarr;
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Classroom Footer Section */}
      <footer className="bg-stone-900 text-stone-300 py-12 border-t-4 border-[#8C1D40]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h5 className="font-serif font-bold text-lg text-white">About Physics4Students</h5>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                A non-profit open education database for Advanced Placement (AP), International Baccalaureate (IB), 
                and standard undergraduate honors physics curriculums worldwide.
              </p>
            </div>
            <div className="space-y-3">
              <h5 className="font-serif font-bold text-lg text-white">Institutional Partners</h5>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                Hosted in association with Unified District High Schools, Virtual Science Laboratories Foundation, 
                and various contributing secondary school physics faculty departments.
              </p>
            </div>
            <div className="space-y-3">
              <h5 className="font-serif font-bold text-lg text-white">Teacher Admin Controls</h5>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                Classroom performance logs and curriculum review channels are securely protected under single sign-on (SSO) procedures.
              </p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-stone-500">
            <p>© 2026 Physics4Students Educational Resources Foundation. All Rights Reserved.</p>
            <div className="flex gap-4">
              <span>Privacy Codex</span>
              <span>Terms of Use</span>
              <span>Metadata Manifest</span>
            </div>
          </div>
        </div>
      </footer>

      {/* SSO Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative max-w-md w-full bg-white border border-stone-200 rounded-lg overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-stone-50 hover:bg-stone-150 border border-stone-200 text-stone-500 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 text-center">
              <div className="mx-auto w-12 h-12 bg-stone-100 border border-stone-200 text-[#0F2D59] rounded flex items-center justify-center shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0F2D59]">
                District Single Sign-On (SSO)
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto font-sans leading-relaxed">
                Connect using school domain credentials. Student logs, teacher review portfolios, and system telemetry records remain encrypted.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="block text-xs text-stone-500 font-serif font-bold">
                  District Identifier (Username) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. j.doe@schooldistrict.edu"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-[#0F2D59] text-stone-800 text-xs px-3.5 py-2.5 rounded outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-xs text-stone-500 font-serif font-bold">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-[#0F2D59] text-stone-800 text-xs px-3.5 py-2.5 rounded outline-none transition-colors"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-150 leading-relaxed font-sans">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F2D59] hover:bg-[#1a447c] text-white font-serif font-bold text-xs uppercase tracking-wider rounded shadow-md cursor-pointer transition-colors"
              >
                <span>Authorize Credentials</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1">
              <HelpCircle className="w-3 h-3" />
              <span>Security token issued by UD-SSO.</span>
            </div>
          </div>
        </div>
      )}

      {/* scholastic Article Reader Overlay */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative max-w-3xl w-full bg-[#FCFBF7] border border-stone-200 rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header bar */}
            <div className="p-4 sm:p-6 border-b border-stone-200 bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider font-semibold uppercase bg-stone-100 text-[#8C1D40] px-2 py-0.5 rounded border border-stone-200">
                  {activeArticle.category}
                </span>
              </div>
              <button 
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded-lg bg-stone-50 hover:bg-stone-150 border border-stone-200 text-stone-500 cursor-pointer transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
              
              <div className="space-y-2 pb-4 border-b border-stone-200">
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-stone-950 leading-tight">
                  {activeArticle.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400 font-mono">
                  <span className="flex items-center gap-1 text-stone-600 font-bold">
                    <User className="w-4 h-4 text-stone-400" />
                    {activeArticle.author}
                  </span>
                  <span>•</span>
                  <span>Published: {activeArticle.date}</span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                </div>
              </div>

              {/* Body */}
              <div className="font-serif text-stone-800 text-sm sm:text-md space-y-4 leading-relaxed tracking-wide">
                {activeArticle.fullBody.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Equational models banner */}
              {activeArticle.equations.length > 0 && (
                <div className="bg-white border border-stone-200 rounded p-4 sm:p-5 text-center space-y-2">
                  <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest font-bold">Mathematical Formulations</span>
                  <div className="flex flex-col gap-2">
                    {activeArticle.equations.map((eq, i) => (
                      <code key={i} className="block text-sm sm:text-base font-mono text-[#0F2D59] bg-stone-50 border border-stone-150 py-2 px-4 rounded max-w-md mx-auto">{eq}</code>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus review questions */}
              <div className="p-5 border border-amber-100 rounded-lg bg-amber-50/20 space-y-3">
                <h5 className="font-serif font-black text-xs uppercase tracking-wider text-[#8C1D40]">Syllabus Review Exercises</h5>
                <ul className="space-y-2.5 text-xs text-stone-600 font-sans leading-relaxed">
                  {activeArticle.reviewQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>

              {/* Metadata tags */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-2 text-[10px] text-stone-400 font-mono">
                <span>INDEX_LEVEL: {activeArticle.difficulty.toUpperCase()}</span>
                <span>•</span>
                {activeArticle.keyTerms.map(term => (
                  <span key={term} className="text-[#0F2D59]">#{term.toUpperCase()}</span>
                ))}
              </div>

            </div>

            {/* Read bottom control bar */}
            <div className="p-4 bg-white border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-mono tracking-wide rounded cursor-pointer transition-colors"
              >
                Close Scholarly Document
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
