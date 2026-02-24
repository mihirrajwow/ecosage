"""
EcoSage Knowledge Base
Rich sustainability content indexed for RAG retrieval.
Add your own documents or URLs to expand this knowledge base.
"""

SUSTAINABILITY_DOCS = [
    # ── PLASTIC & WASTE ──────────────────────────────────────────────────────
    {
        "id": "plastic-001",
        "title": "Reducing Single-Use Plastics at Home",
        "content": """
Single-use plastics are one of the biggest contributors to ocean pollution and landfill waste.
Key actions to reduce plastic at home:
- Replace plastic wrap with beeswax wraps or silicone lids
- Use reusable shopping bags, produce bags, and bulk containers
- Switch to bar soap, shampoo bars, and refillable cosmetics
- Replace plastic bottles with stainless steel or glass containers
- Buy loose-leaf tea instead of tea bags (many contain microplastics)
- Use bamboo or wooden utensils and toothbrushes
- Choose products with minimal or recyclable packaging
- Start a 'plastic audit' — track your plastic for one week to identify biggest sources
The 5 Rs of zero waste: Refuse, Reduce, Reuse, Recycle, Rot (compost).
Microplastics are now found in human blood, lungs, and placentas — reducing plastic use is a personal health issue too.
""",
        "category": "waste",
    },
    {
        "id": "plastic-002",
        "title": "Understanding Plastic Recycling Numbers",
        "content": """
Plastic recycling symbols (1-7) indicate the resin type, not recyclability:
- #1 PET (water bottles, food containers) — widely recyclable
- #2 HDPE (milk jugs, shampoo bottles) — widely recyclable
- #3 PVC (pipes, flooring) — rarely recyclable, contains harmful additives
- #4 LDPE (plastic bags, film) — some store drop-off programs accept it
- #5 PP (yogurt containers, bottle caps) — increasingly recyclable
- #6 PS / Styrofoam — almost never recyclable, avoid it
- #7 Other (including BPA polycarbonate) — usually not recyclable
Only about 9% of all plastic ever produced has been recycled. 'Wishcycling' (putting non-recyclables in recycling bins) contaminates loads and hurts recycling rates.
Always check your local municipality's accepted materials list.
""",
        "category": "waste",
    },
    {
        "id": "composting-001",
        "title": "Composting Basics: From Apartment to Garden",
        "content": """
Composting diverts organic waste from landfills where it produces methane (a potent greenhouse gas) and turns it into nutrient-rich soil amendment.
Apartment composting options:
- Countertop compost bins with filters (collect scraps, drop at community sites)
- Worm bins (vermicomposting) — can live under a sink, nearly odorless if managed well
- Bokashi fermentation — ferments ALL food waste including meat and dairy
Backyard composting:
- Hot composting: balance greens (nitrogen) and browns (carbon) 1:3, keep moist, turn weekly, ready in 6-8 weeks
- Cold composting: just pile it up, takes 6-12 months but no effort required
What to compost: fruit and vegetable scraps, coffee grounds and filters, tea leaves, eggshells, paper, cardboard, yard waste
What NOT to compost: meat, fish, dairy (in open bins — attracts pests), diseased plants, pet waste, oily foods
Community composting: many cities have drop-off sites or curbside pickup. Check ShareWaste.com to find neighbors with compost bins.
Food waste represents about 8-10% of global greenhouse gas emissions. Composting is one of the highest-impact individual actions.
""",
        "category": "waste",
    },

    # ── ENERGY ───────────────────────────────────────────────────────────────
    {
        "id": "energy-001",
        "title": "Home Energy Conservation Tips",
        "content": """
Home energy use accounts for about 20% of greenhouse gas emissions in developed countries.
Top energy-saving actions ranked by impact:
1. Switch to LED bulbs (use 75% less energy than incandescent, last 15x longer)
2. Improve home insulation and seal air leaks (windows, doors, attic) — biggest heating/cooling savings
3. Install a programmable or smart thermostat — save 10-15% on heating/cooling bills
4. Wash clothes in cold water (90% of washing machine energy goes to heating water)
5. Line-dry clothes when possible — dryers are energy-intensive
6. Unplug devices or use smart power strips — 'phantom loads' account for 5-10% of home electricity
7. Switch to heat pump HVAC and water heater (2-3x more efficient than gas)
8. Cook on induction stovetops (more efficient than gas or electric coils)
9. Use a microwave or toaster oven instead of full oven for small meals
10. Run dishwasher only when full, use eco mode
Energy audit: Many utilities offer free home energy audits to identify biggest savings opportunities.
""",
        "category": "energy",
    },
    {
        "id": "energy-002",
        "title": "Solar Energy for Homeowners and Renters",
        "content": """
Solar power is now the cheapest electricity source in history and accessible to many households.
For homeowners:
- Rooftop solar payback period is typically 6-10 years, lifespan 25-30 years
- Federal Investment Tax Credit (ITC) in the US offers 30% tax credit through 2032
- Community solar programs let you buy into a local solar farm without rooftop installation
- Net metering allows you to sell excess electricity back to the grid in many states
For renters:
- Community solar subscriptions — subscribe to a portion of a solar farm, get credit on your bill
- Portable solar panels for balconies or windows (charges devices, small appliances)
- Green energy tariffs — pay a small premium for your utility to match your usage with renewable sources
Other renewable home options:
- Small wind turbines for rural properties
- Solar water heaters (can cover 50-80% of hot water needs)
- Geothermal heat pumps — very efficient but high upfront cost
Battery storage (like Tesla Powerwall) pairs well with solar for backup power and peak-hour savings.
""",
        "category": "energy",
    },

    # ── FOOD ─────────────────────────────────────────────────────────────────
    {
        "id": "food-001",
        "title": "Sustainable Eating: Food Choices and the Planet",
        "content": """
The food system accounts for roughly 26% of global greenhouse gas emissions.
Most impactful dietary shifts ranked by carbon savings:
1. Reduce beef and lamb (ruminants produce methane via enteric fermentation)
2. Reduce dairy consumption (especially cheese and butter)
3. Reduce pork and poultry (lower impact than beef but still significant)
4. Shift to plant proteins: legumes, tofu, tempeh, nuts — dramatically lower footprint
Food carbon footprint per kg of protein (approximate):
- Beef: 60 kg CO2e | Lamb: 24 | Pork: 7 | Chicken: 6 | Tofu: 3 | Legumes: 0.9
Going fully plant-based can reduce your food-related emissions by up to 73%.
Even one meat-free day per week (Meatless Monday) reduces food carbon footprint by ~14%.
Other high-impact food actions:
- Reduce food waste (30-40% of food in developed countries is wasted)
- Buy local and seasonal produce (reduces transport and storage emissions)
- Choose organic for the 'dirty dozen' pesticide-heavy crops
- Grow your own herbs, vegetables, or sprouts
- Choose sustainably certified seafood (MSC, ASC labels)
""",
        "category": "food",
    },
    {
        "id": "food-002",
        "title": "Reducing Food Waste at Home",
        "content": """
The average household wastes 30-40% of food they buy. Reducing food waste is one of the top climate solutions identified by Project Drawdown.
Smart shopping:
- Plan meals for the week before shopping
- Write a shopping list and stick to it
- Shop more frequently in smaller amounts for fresh produce
- Buy 'ugly' or imperfect produce (same nutrition, often cheaper)
Smart storage:
- Learn which foods should NOT be refrigerated (bananas, tomatoes, potatoes, onions)
- Store herbs like flowers in a glass of water
- Understand the difference: 'best by' = quality, 'use by' = safety
- FIFO principle: First In, First Out — move older items to front of fridge/pantry
Rescue strategies:
- Overripe bananas → freeze for smoothies or banana bread
- Wilting vegetables → soups, stews, stir-fries
- Stale bread → croutons, breadcrumbs, panzanella
- Vegetable scraps → homemade stock
Apps to reduce food waste: Too Good To Go (buy surplus restaurant food), OLIO (share food with neighbors), Flashfood (discounted near-expiry groceries).
""",
        "category": "food",
    },

    # ── WATER ────────────────────────────────────────────────────────────────
    {
        "id": "water-001",
        "title": "Water Conservation in Daily Life",
        "content": """
Freshwater is one of Earth's most precious and threatened resources. Only 3% of Earth's water is fresh, and 2/3 of that is frozen.
High-impact water saving tips:
Bathroom (largest home water use):
- Shorten showers to 5 minutes (saves ~10 gallons/minute)
- Install low-flow showerheads (save 50% of shower water with no comfort loss)
- Fix leaking toilets (a running toilet wastes up to 200 gallons per day)
- Turn off tap while brushing teeth (saves 8 gallons per session)
- Install dual-flush or low-flow toilet (toilets account for 30% of indoor water use)
Kitchen:
- Run dishwasher only when full
- Thaw frozen foods in refrigerator overnight, not under running water
- Steam vegetables instead of boiling (saves water and preserves nutrients)
- Collect pasta/vegetable cooking water for plants
Garden and outdoors:
- Water plants in early morning or evening to reduce evaporation
- Collect rainwater for garden use (check local regulations)
- Plant drought-resistant native species
- Use drip irrigation instead of sprinklers (90% efficient vs 65%)
Virtual water: The products we buy contain 'embedded' water. 1 kg of beef requires ~15,000 liters of water. 1 cotton t-shirt requires ~2,700 liters. Dietary and consumption choices have a huge water footprint.
""",
        "category": "water",
    },

    # ── TRANSPORT ────────────────────────────────────────────────────────────
    {
        "id": "transport-001",
        "title": "Sustainable Transportation Options",
        "content": """
Transportation accounts for about 16% of global greenhouse gas emissions, with personal vehicles being the largest share in developed countries.
Carbon footprint per km by mode (approximate gCO2e):
- Short-haul flight: 255 | Long-haul flight: 195 | Gasoline car (solo): 192 | Car with 3 passengers: 64 | EV on avg grid: 53 | Bus: 27 | Train: 14 | E-bike: 7 | Cycling: 5 | Walking: 0
Reducing transport emissions:
1. Drive less — combine errands, work from home when possible
2. Walk or cycle for short trips (under 3 miles)
3. Use public transit — buses, trains, trams
4. Carpool or use ride-share for car trips
5. Switch to an EV (even on an average grid, lower lifetime emissions than ICE)
6. Reduce flying — one transatlantic flight ≈ 1-3 months of other emissions
7. Choose direct flights (takeoff and landing emit most)
8. Buy or rent locally to avoid shipping emissions
Cycling infrastructure: Cities with good cycling infrastructure (Netherlands, Denmark) have dramatically lower transport emissions per capita and better health outcomes.
E-bikes open up cycling to more people, replacing car trips for distances up to 15-20 miles with ease.
""",
        "category": "transport",
    },
    {
        "id": "transport-002",
        "title": "Electric Vehicles: Facts and Considerations",
        "content": """
Electric vehicles (EVs) represent a major shift in personal transportation and their environmental benefits are well-documented.
Lifecycle emissions:
- EVs produce 50-70% less lifetime CO2 than gasoline cars in most countries
- The 'carbon payback' period (time to offset higher manufacturing emissions) is typically 1-3 years
- As grids get cleaner with more renewables, EV emissions drop further automatically
- In countries with clean grids (France, Norway, NZ), EVs approach zero carbon
EV considerations:
- Battery production requires lithium, cobalt, nickel — mining has environmental impacts
- Battery recycling infrastructure is improving rapidly
- Range anxiety: Most EVs now offer 200-300+ miles per charge; 95% of daily trips are under 40 miles
- Charging: 80% of EV owners charge at home overnight; public fast chargers handle longer trips
Cost of ownership:
- EVs have lower fuel costs (electricity vs gasoline)
- Lower maintenance costs (no oil changes, fewer brake jobs due to regenerative braking)
- Higher purchase price, but total cost of ownership is often lower over 5-7 years
Alternatives if EV isn't accessible: hybrid vehicles, car-sharing services, e-bikes, public transit.
""",
        "category": "transport",
    },

    # ── CLIMATE CHANGE ───────────────────────────────────────────────────────
    {
        "id": "climate-001",
        "title": "Climate Change: Key Facts and Science",
        "content": """
Climate change refers to long-term shifts in global temperatures and weather patterns, primarily driven by human activities since the 1800s.
Key scientific facts:
- Global average temperature has risen ~1.1°C above pre-industrial levels
- The Paris Agreement aims to limit warming to 1.5°C (ideally) or 2°C
- CO2 concentration in atmosphere: 420 ppm (highest in 3 million years)
- 2015-2023 were the 9 hottest years on record
- Arctic is warming 3-4x faster than global average
Main greenhouse gases: CO2 (fossil fuels, deforestation), Methane (livestock, natural gas, landfills), Nitrous Oxide (agriculture), F-gases (refrigerants)
Impacts of climate change:
- More frequent and intense extreme weather (heat waves, hurricanes, floods, droughts)
- Sea level rise (0.3-1m+ by 2100, threatening coastal cities)
- Ocean acidification (threatens marine ecosystems, coral reefs)
- Biodiversity loss and ecosystem disruption
- Food and water security risks
- Climate migration and displacement
The IPCC Sixth Assessment Report (2022) confirms: rapid, deep, immediate emissions reductions are needed across all sectors to avoid the worst impacts.
""",
        "category": "climate",
    },
    {
        "id": "climate-002",
        "title": "Carbon Footprint: Understanding and Reducing Yours",
        "content": """
A carbon footprint is the total greenhouse gas emissions caused by an individual, organization, event, or product.
Average carbon footprints (tonnes CO2e/year):
- Global average: ~4 tonnes | US: ~16 | EU: ~7 | India: ~2 | Sustainable target: <2
Your biggest emission categories (typical developed-country individual):
1. Food (especially meat and dairy): 15-30%
2. Transportation (especially flying and driving): 25-30%
3. Home energy: 15-25%
4. Consumption (goods, clothing, electronics): 20-30%
5. Services (healthcare, government, etc.): 10-15%
Highest-impact individual actions (Project Drawdown / Seth Wynes research):
1. Have one fewer child (if applicable to your situation)
2. Live car-free
3. Avoid one transatlantic flight per year
4. Eat a plant-based diet
5. Switch to renewable energy at home
Carbon offsets: Useful as a last resort for unavoidable emissions, but not a substitute for reducing emissions. Choose high-quality offsets (Gold Standard, VCS certified). Forest-based offsets vary widely in quality.
Systems change vs individual action: Both matter. Individual choices have direct impact AND signal market demand AND build political will for policy change.
""",
        "category": "climate",
    },

    # ── CIRCULAR ECONOMY ─────────────────────────────────────────────────────
    {
        "id": "circular-001",
        "title": "The Circular Economy Explained",
        "content": """
The circular economy is an economic model designed to eliminate waste and keep resources in use as long as possible, in contrast to the traditional 'take-make-dispose' linear model.
Three principles (Ellen MacArthur Foundation):
1. Design out waste and pollution — redesign products so waste doesn't exist
2. Keep products and materials in use — repair, reuse, remanufacture, recycle
3. Regenerate natural systems — return nutrients to soil, restore ecosystems
Circular economy in practice:
- Product-as-a-service: lease a washing machine instead of buying (manufacturer keeps ownership, incentivized to make it last)
- Repair culture: right-to-repair legislation allows consumers to fix their own devices
- Sharing economy: libraries, tool libraries, clothing swaps, car sharing
- Industrial symbiosis: one company's waste becomes another's raw material
- Closed-loop recycling: materials are recycled back into the same product (aluminum cans → new cans)
- Biomimicry: design inspired by nature's waste-free cycles
For individuals:
- Buy secondhand first (clothing, furniture, electronics, books)
- Choose durable, repairable products over disposable ones
- Return old electronics to manufacturer recycling programs
- Participate in repair cafes and community workshops
- Rent instead of buy for infrequently used items
Fast fashion is one of the most anti-circular industries: 85% of textiles end up in landfill or incinerated.
""",
        "category": "circular",
    },

    # ── BIODIVERSITY ─────────────────────────────────────────────────────────
    {
        "id": "biodiversity-001",
        "title": "Biodiversity Loss and Why It Matters",
        "content": """
Biodiversity refers to the variety of life on Earth — from genes to species to ecosystems.
Current biodiversity crisis (often called the Sixth Mass Extinction):
- Wildlife populations have declined by an average of 69% since 1970 (WWF Living Planet Report)
- Up to 1 million species face extinction in coming decades (IPBES)
- Species are going extinct at 100-1000x the natural background rate
Main drivers (IPBES):
1. Land use change (agriculture, urbanization, deforestation) — #1 driver
2. Overexploitation (overfishing, hunting, wildlife trade)
3. Climate change — increasingly important driver
4. Pollution (pesticides, plastics, nitrogen from fertilizers)
5. Invasive species
Why biodiversity matters:
- Ecosystem services: pollination, water purification, soil fertility, flood control — valued at $125-145 trillion/year
- Food security: 75% of food crops depend on animal pollination
- Medicine: 70% of cancer drugs are derived from natural sources
- Climate regulation: forests, wetlands, and oceans absorb CO2
- Intrinsic value: species have a right to exist
How to help:
- Support rewilding and conservation organizations
- Plant native species in gardens (better for local wildlife)
- Reduce pesticide use
- Eat lower on the food chain
- Reduce consumption of products linked to deforestation (palm oil, beef, soy)
- Choose sustainably sourced wood and paper (FSC certified)
""",
        "category": "biodiversity",
    },

    # ── GREEN BUILDING ────────────────────────────────────────────────────────
    {
        "id": "building-001",
        "title": "Sustainable Home and Building Practices",
        "content": """
Buildings account for nearly 40% of global energy consumption and 33% of greenhouse gas emissions.
Home efficiency upgrades by ROI and impact:
1. Air sealing and insulation — highest ROI, often 20-30% energy savings
2. Double/triple-glazed windows — reduce heat loss significantly
3. Heat pump (air source or ground source) for heating and cooling — 2-4x more efficient than gas
4. Heat pump water heater — 3-4x more efficient than electric resistance heater
5. LED lighting — completed by most households, still important
6. Smart thermostat — automated temperature control
7. Solar panels — long-term investment with good returns
Green building certifications:
- LEED (Leadership in Energy and Environmental Design) — gold standard in commercial
- Passivhaus — ultra-low energy standard, very comfortable buildings
- BREEAM — widely used in UK and Europe
- Living Building Challenge — most rigorous standard, regenerative design
Embodied carbon: The carbon locked into building materials (concrete, steel, lumber). Low-carbon materials: mass timber (cross-laminated timber, CLT), bamboo, recycled steel, hempcrete.
When renovating or building, prioritize:
- Orientation (south-facing in northern hemisphere for passive solar)
- Thermal mass (stores heat, reduces temperature swings)
- Natural ventilation to reduce AC needs
- Water harvesting and greywater recycling
""",
        "category": "buildings",
    },

    # ── SUSTAINABLE CONSUMPTION ───────────────────────────────────────────────
    {
        "id": "consumption-001",
        "title": "Conscious Consumption and Sustainable Shopping",
        "content": """
Consumer goods production accounts for 45% of global greenhouse gas emissions when you include supply chains.
Hierarchy of sustainable consumption (best to worst):
1. Don't buy (do you really need it?)
2. Borrow, rent, or share
3. Buy secondhand (thrift, vintage, resale apps)
4. Buy refurbished or remanufactured
5. Buy new — but durable, repairable, from ethical brands
6. Last resort: buy new conventional
Electronics:
- Extending a smartphone's life from 2 to 4 years halves its carbon impact
- Refurbished electronics are 2-5x cheaper and work just as well
- Look for iFixit repairability scores before buying
- Fairphone is designed for repairability and ethical supply chains
Clothing:
- Fast fashion produces 10% of global CO2 and 20% of global wastewater
- A garment worn 30 times has 6x lower impact than one worn 5 times
- Natural fibers (organic cotton, linen, hemp) vs. synthetic (polyester sheds microplastics)
- Second-hand platforms: ThredUp, Poshmark, Vinted, local thrift stores
Certifications to trust:
- B Corp — company meets high social and environmental standards
- Fair Trade — fair wages and conditions for producers
- Organic (USDA, EU) — no synthetic pesticides or fertilizers
- Rainforest Alliance, MSC (seafood), FSC (wood/paper)
Greenwashing: Watch for vague claims like 'eco-friendly', 'natural', 'green' without certification. Look for specific claims with third-party verification.
""",
        "category": "consumption",
    },

    # ── ACTIVISM & POLICY ─────────────────────────────────────────────────────
    {
        "id": "activism-001",
        "title": "Environmental Advocacy and Systemic Change",
        "content": """
Individual action is important, but systemic change through policy and collective action is essential to address environmental challenges at scale.
Why both individual and systemic action matter:
- Individual choices reduce emissions AND signal demand AND build political will
- Policy changes can achieve what individual action cannot (e.g., carbon pricing, building codes, EV mandates)
- Research shows civic and political engagement may have higher impact than individual lifestyle changes
Ways to engage:
1. Vote for candidates with strong environmental platforms at all levels of government
2. Contact your representatives about climate and environmental policy
3. Join or support environmental organizations (local and national)
4. Participate in peaceful protests and demonstrations (e.g., Fridays for Future, Extinction Rebellion)
5. Engage your workplace, school, or community organization
6. Divest from fossil fuels (switch banks, move pension investments)
7. Support environmental litigation and legal organizations
8. Use your professional skills — every profession has environmental applications
Key policy levers that research shows are most effective:
- Carbon pricing (carbon tax or cap-and-trade)
- Clean electricity standards and renewable energy mandates
- Building efficiency codes
- Phasing out fossil fuel subsidies ($5.9 trillion/year globally)
- Protecting and restoring ecosystems
- Sustainable agriculture policy
""",
        "category": "policy",
    },
]
