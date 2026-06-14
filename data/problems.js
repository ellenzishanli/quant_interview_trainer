/*
 * Problem data for the Quant Interview Trainer.
 * Source: "A Practical Guide to Quantitative Finance Interviews" (Xinfeng Zhou) — the "Green Book".
 *
 * Brain Teasers (Chapter 2) is fully populated with the real problems & solutions.
 * Chapters 3-7 are scaffolded from the book's table of contents as placeholders,
 * ready to be filled in the same shape.
 *
 * Math: simple symbols use Unicode; complex formulas use KaTeX delimiters $...$ and $$...$$.
 * Prose fields are Markdown.
 */
(function () {
  // Placeholder problem: title (and optional difficulty) only, no content yet.
  function ph(title, difficulty) {
    return { title: title, difficulty: difficulty || null, placeholder: true };
  }

  window.QUANT_DATA = {
    meta: {
      title: "Quant Interview Trainer",
      source: "A Practical Guide to Quantitative Finance Interviews — Xinfeng Zhou",
      difficulties: ["easy", "medium", "hard"]
    },
    chapters: [
      {
        num: 2,
        title: "Brain Teasers",
        blurb: "Problems that need common sense, logic and creativity rather than heavy math. They test how you think, not what you memorized.",
        topics: [
          {
            id: "2.1",
            title: "Problem Simplification",
            note: "When a problem looks too complex, solve the smallest case first and grow the complexity until a pattern emerges.",
            problems: [
              {
                title: "Screwy Pirates",
                difficulty: "hard",
                tags: ["game theory", "backward induction", "simplification"],
                statement: "Five pirates loot a chest of 100 gold coins. They are democratic but ruthless. The most senior pirate proposes how to split the coins; **all** pirates (including the proposer) vote. If at least 50% accept, the split happens. Otherwise the proposer is thrown overboard and the next most-senior pirate proposes, and so on. Each pirate is perfectly rational and, in order: (1) wants to survive, (2) wants to maximize his gold, (3) all else equal, prefers fewer pirates left. How should the most senior pirate split the 100 coins?",
                hint: "Don't start with 5 pirates. Start with 1, then 2, then build up — the pattern appears quickly.",
                solution: "**The trick:** 5 pirates at once feels impossible, so shrink the problem. Solve the tiniest versions first, then climb back up — at each step a senior pirate only needs to *buy just enough votes to survive*.\n\nFirst, keep the rules straight: a plan passes with **50% or more** of the votes (so the proposer's own vote carries real weight), and each pirate's priorities, in order, are **(1) stay alive → (2) grab the most gold → (3) tie-break: prefer fewer pirates left**.\n\nNumber them P1 (most junior) up to P5 (most senior, who proposes first). Now build up:\n\n- **Only P1 left:** he keeps all 100. *(1 of 1 votes = 100% ≥ 50%.)*\n- **P2 & P1:** P2 votes for his own plan — 1 of 2 votes = 50%, which passes. So **P2 takes all 100, P1 gets 0.**\n- **P3, P2, P1:** P3 needs just **one** extra vote. Who's cheapest? **P1** — because if P3 is tossed overboard, we drop into the 'P2 & P1' world where P1 gets **0**. So a single coin beats his alternative. → **P3: 99, P2: 0, P1: 1.**\n- **P4, P3, P2, P1:** P4 needs one extra vote. If P4 dies we land in the P3 world where **P2 gets 0** — so P4 buys **P2** with 1 coin. → **P4: 99, P3: 0, P2: 1, P1: 0.**\n- **All 5:** P5 needs **two** extra votes. If P5 dies we reach the P4 world where **P1 and P3 each get 0** — they're the two cheapest to flip. Give each **one coin**.\n\n**Answer: P5 keeps 98, gives 1 coin each to P1 and P3, nothing to P2 and P4.** The vote passes 3–2.\n\nThe pattern: every proposer bribes exactly the pirates who would walk away with nothing in the next-smaller game.",
                keyIdea: "Backward induction: anchor on the trivial base case and let each player reason about what happens if his proposal is rejected. The proposer only needs to bribe the cheapest votes."
              },
              {
                title: "Tiger and Sheep",
                difficulty: "medium",
                tags: ["game theory", "parity", "induction"],
                statement: "One hundred tigers and one sheep are on a magic island with only grass. Tigers can eat grass, but would rather eat the sheep. If a tiger eats the sheep it **becomes** a sheep (and can then be eaten). All tigers are perfectly rational and want to survive. Will the sheep be eaten?",
                hint: "Start with 1 tiger, then 2, then 3. The answer depends only on whether the number of tigers is odd or even.",
                solution: "**Intuition:** a tiger only eats the sheep if eating it doesn't turn *itself* into the next victim. Whether that's safe flips back and forth as we add tigers — and that flip is the entire answer.\n\nBuild it up one tiger at a time, each time asking: *'If I eat the sheep, do I survive the world I just created?'*\n\n- **1 tiger:** after eating it becomes the sheep, but there's no one left to eat it. Safe to eat → 🐑 **eaten**.\n- **2 tigers:** if one eats, it turns into a sheep — and the other tiger is now in the '1 tiger' situation and *will* eat it. Too risky → nobody eats → 🐑 **safe**.\n- **3 tigers:** eating creates a '2 tigers' world, where we just saw the sheep is **safe**. So the eater survives → it eats → 🐑 **eaten**.\n- **4 tigers:** eating creates a '3 tigers' world where the sheep gets eaten — so eating is suicide → 🐑 **safe**.\n\nNotice the pattern flips every time: **odd number of tigers → sheep eaten; even → sheep safe.** With **100** tigers (even), the sheep is **safe — not eaten**.",
                keyIdea: "Parity argument via induction. Each tiger's safety depends on whether the situation it creates leaves an odd or even number of tigers."
              }
            ]
          },
          {
            id: "2.2",
            title: "Logic Reasoning",
            problems: [
              {
                title: "River Crossing",
                difficulty: "easy",
                tags: ["logic", "optimization"],
                statement: "Four people A, B, C, D must cross a river over a bridge that holds at most 2 people at a time. It's dark and they share one torch, which must travel with every crossing. A pair walks at the slower person's speed. Crossing times: A = 10 min, B = 5 min, C = 2 min, D = 1 min. What is the minimum time to get everyone across?",
                hint: "The key is to make the two slowest people (A and B) cross together.",
                solution: "**The key realization:** the 10-minute person is the bottleneck. You never want to waste a whole trip on them alone — instead send the **two slowest people (10 and 5) together**, so the 5-minute trip hides *inside* the 10-minute one and you only pay for it once. To set that up, use the two fastest people (C and D) as the shuttle drivers.\n\n1. **C & D cross** → 2 min  *(now C, D are on the far side)*\n2. **D comes back** with the torch → 1 min\n3. **A & B cross together** → 10 min  *(the two slow ones, in a single trip)*\n4. **C comes back** with the torch → 2 min\n5. **C & D cross** → 2 min\n\nTotal: 2 + 1 + 10 + 2 + 2 = **17 minutes** — and that's the minimum. *(Swapping who returns in steps 2/4 also gives 17.)*",
                keyIdea: "Pair the two slowest travelers so you only 'pay' for the 10-minute crossing once. Use the fastest people as torch-bearers/ferries."
              },
              {
                title: "Birthday Problem (Cheryl's Birthday)",
                difficulty: "medium",
                tags: ["logic", "deduction", "knowledge"],
                statement: "Boss A's birthday is one of: Mar 4, Mar 5, Mar 8; Jun 4, Jun 7; Sep 1, Sep 5; Dec 1, Dec 2, Dec 8. A tells colleague B only the **month** and colleague C only the **day**. Then:\n\n- B says: *“I don't know A's birthday, but I know C doesn't know it either.”*\n- C says: *“I didn't know A's birthday, but now I know it.”*\n- B says: *“Now I know it too.”*\n\nWhat is A's birthday?",
                hint: "Just follow what each statement reveals about the month and day, step by step.",
                solution: "**The idea:** nobody ever says the date out loud. Each sentence instead tells you what that person *can* or *can't* figure out — and each one quietly eliminates options. Track them in order.\n\nFirst, list how often each **day** appears: 1, 2, 4, 5, 7, 8. Two days are *unique* — **2** (only Dec 2) and **7** (only Jun 7). Hold that thought.\n\n**Statement 1 — B: \"I don't know, but I know C doesn't either.\"** B only knows the month. For B to be *certain* C can't already know, the month must contain **no unique day**. Jun has the unique day 7, and Dec has the unique day 2 — so B can rule those out only if B's month isn't one of them. → the month is **March or September**.\nSurvivors: Mar 4, Mar 5, Sep 1, Sep 5.\n\n**Statement 2 — C: \"Now I know it.\"** C knows the day. Among the four survivors, day **5** appears twice (Mar 5 *and* Sep 5), so if C had a 5 they'd still be stuck. Since C is now sure, the day is **not 5**. → survivors: **Mar 4** or **Sep 1**.\n\n**Statement 3 — B: \"Now I know it too.\"** B knows the month. The two survivors are in *different* months (March vs September), so the month alone pins it down — consistent with B being sure.\n\nBoth remaining options work for B, but only one day-value (from step 2) leaves a single candidate per month, and the unique consistent answer is **September 1**.",
                keyIdea: "Common-knowledge deduction: each statement eliminates possibilities not by revealing the secret directly but by revealing what the speaker *can* and *cannot* deduce."
              },
              {
                title: "Card Game",
                difficulty: "medium",
                tags: ["symmetry", "expected value"],
                statement: "A casino offers a game with a normal 52-card deck. You flip two cards at a time. If both are black they go to the dealer's pile; if both red, to your pile; if mixed, discarded. After all 52 cards, whoever has more cards wins \\$100; otherwise you get nothing. How much would you pay to play?",
                hint: "Use symmetry: every discarded pair removes one red and one black card.",
                solution: "**Intuition:** instead of tracking every shuffle, look for something that *never changes* no matter how the cards fall. Here it's the colors — a discarded 'mixed' pair always throws away **one red and one black together**.\n\nSo follow the two colors:\n- Your pile only ever gains **reds**; the dealer's pile only ever gains **blacks**.\n- The deck starts with **26 red and 26 black**, and every removal (your pair, the dealer's pair, or a discard) takes them in a way that keeps the *leftover* reds and blacks marching down in lockstep.\n\nThe upshot: the number of cards you collect always **exactly equals** the number the dealer collects. **Every game is a tie.**\n\nSince you can never come out ahead, the game is worth exactly **\\$0 — don't pay anything to play.**",
                keyIdea: "A symmetry/invariant argument: a mixed pair removes one of each color, so red-count and black-count remaining are always equal. The game is always a tie."
              },
              {
                title: "Burning Ropes",
                difficulty: "easy",
                tags: ["logic", "time measurement"],
                statement: "You have two ropes, each of which burns in exactly 1 hour, but burn unevenly (different densities along the rope). Using only these ropes, how do you measure exactly 45 minutes?",
                hint: "Light a rope from both ends and it burns in half the time, regardless of unevenness.",
                solution: "**The key insight:** you can't trust any *point* on the rope (it burns unevenly), but you *can* trust the total — each rope always takes exactly 60 minutes end-to-end. And lighting a rope from **both ends** makes the two flames jointly eat the whole rope in half the time: **30 minutes**, no matter where they meet.\n\nNow combine that to build 45 = 30 + 15:\n\n1. **At t = 0:** light **rope 1 at both ends** *and* **rope 2 at one end**.\n2. **At t = 30 min:** rope 1 is fully burned (both-ends trick). Rope 2, lit at one end, has burned for 30 min so it has exactly **30 minutes of length left**. At this instant, **light rope 2's other end** too.\n3. Rope 2's remaining 30-min stub now burns from both ends → gone in **15 more minutes**.\n\nTotal elapsed: 30 + 15 = **45 minutes**.",
                keyIdea: "Burning a rope from both ends always halves its time even when burning is uneven, because the two flames jointly consume the whole length."
              },
              {
                title: "Defective Ball (12 Balls)",
                difficulty: "hard",
                tags: ["weighing", "information", "search"],
                statement: "You have 12 identical-looking balls. One is defective — either heavier OR lighter than the rest (you don't know which). Using a balance scale only **3 times**, identify the defective ball (and ideally whether it's heavy or light).",
                hint: "First try it for 9 balls in 2 weighings when you already know the odd one is heavier. The key is to split into three groups of equal size, not two.",
                solution: "**Why thirds, not halves?** A balance has *three* possible outcomes each time (left-heavy, right-heavy, balanced), so each weighing gives you up to 3-way information. With 3 weighings that's up to $3^3 = 27$ distinguishable outcomes — plenty for 12 balls × 2 (heavy or light). The catch is you don't know whether the bad ball is heavy or light, so you must design the weighings to reveal *both* which ball and its direction.\n\nLabel the balls 1–12 and split into three groups of 4.\n\n**Weighing 1 — {1,2,3,4} vs {5,6,7,8}:**\n\n**Case A — they balance.** The bad ball is among {9,10,11,12}, and balls 1–8 are all good.\n- **Weighing 2 — 9,10,11 vs 1,2,3 (known-good):**\n  - *Balances* → ball **12** is the culprit. **Weighing 3:** 12 vs a good ball tells you heavy or light.\n  - *Tips* → you now know the direction (e.g. heavy) and it's one of 9,10,11. **Weighing 3:** 9 vs 10 — heavier one is it, or if they balance it's 11.\n\n**Case B — they tip (say left side {1,2,3,4} is heavy).** So either one of 1–4 is *heavy*, or one of 5–8 is *light*. Eight suspects, each with a known 'suspected direction'.\n- **Weighing 2 — 1,2,5 vs 3,4,6** (a clever reshuffle that mixes suspects):\n  - *Balances* → the bad ball is among the untested {7,8} (both suspected light). **Weighing 3:** 7 vs 8 — the lighter is it.\n  - *Left still heavy* → consistent only with 1 or 2 being heavy (they stayed on the heavy side) or 6 being light. **Weighing 3:** 1 vs 2 finds it (balance ⇒ 6).\n  - *Tips the other way* → blame 3 or 4 (heavy) or 5 (light); **Weighing 3:** 3 vs 4 finds it (balance ⇒ 5).\n\nEvery branch resolves in exactly **3 weighings**.\n\n**General result:** with $n$ weighings you can pin down the odd ball among up to $\\frac{3^n - 3}{2}$ balls when heavy-or-light is unknown (and up to $3^n$ when you already know which).",
                keyIdea: "Each 3-way weighing yields one of three outcomes (left, right, balance), so it carries $\\log_2 3$ bits. Splitting into thirds (not halves) maximizes information per weighing."
              },
              {
                title: "Trailing Zeros",
                difficulty: "easy",
                tags: ["number theory", "factorials"],
                statement: "How many trailing zeros are there in 100! (100 factorial)?",
                hint: "Each trailing zero needs a factor of 10 = 2 × 5. Count the 5s — they are rarer than the 2s.",
                solution: "**The idea:** a trailing zero is made by a factor of **10**, and $10 = 2 \\times 5$. So each trailing zero needs one '2' and one '5' from the prime factorization of $100!$. Twos are everywhere (every even number gives one), so **fives are the bottleneck** — just count how many factors of 5 are hiding in $100!$.\n\nCount them in layers:\n- **Multiples of 5** (5, 10, 15, …, 100) each contribute at least one 5: $\\lfloor 100/5 \\rfloor = 20$.\n- **Multiples of 25** (25, 50, 75, 100) contribute a *second* 5 each: $\\lfloor 100/25 \\rfloor = 4$.\n- Multiples of 125 would add more, but $125 > 100$, so we stop.\n\nTotal factors of 5 $= 20 + 4 = 24$. So $100!$ ends in exactly **24 zeros**.\n\nThis layered count is **Legendre's formula**: factors of 5 in $n! = \\sum_{k\\ge 1}\\lfloor n/5^k \\rfloor$.",
                keyIdea: "Count the limiting prime factor (5) using Legendre's formula $\\sum_k \\lfloor n/5^k \\rfloor$."
              },
              {
                title: "Horse Race (25 Horses)",
                difficulty: "medium",
                tags: ["logic", "tournament", "sorting"],
                statement: "There are 25 horses, each running at a distinct constant speed. The track has 5 lanes, so you can race at most 5 horses at a time (and you have no timer — only finishing order). What is the minimum number of races to find the **3 fastest** horses?",
                hint: "Race in 5 groups of 5 first, then think about which horses can still be in the top 3.",
                solution: "**Answer: 7 races.** The whole game is *elimination by logic* — after each race, throw out every horse that provably can't be top-3.\n\n**Races 1–5 — race 5 groups of 5.** Now you know the ranking *within* each group. Immediately, the **4th and 5th of every group are out** (4 horses already beat them), leaving 3 live horses per group.\n\n**Race 6 — race the 5 group winners.** This ranks the groups. Call them A > B > C > D > E by their winners' finish. Now prune hard:\n- **Groups D and E:** even their winners are only 4th/5th overall — *all of D and E are out*.\n- **Group A's winner is the overall #1** (he beat all other group winners, who beat everyone in their groups). Lock him in.\n- A horse can be top-3 only if at most 2 horses beat it. Tracing that:\n  - Group A: its 2nd and 3rd could still be #2/#3.\n  - Group B: its winner (1 horse beats him: A's winner) and its 2nd could sneak in.\n  - Group C: only its winner is still alive (2 horses beat him: A's and B's winners).\n\nThat leaves exactly **5 candidates** for the remaining two spots: A2, A3, B1, B2, C1.\n\n**Race 7 — race those 5.** The top two finishers are the 2nd- and 3rd-fastest overall.\n\nTotal: 5 + 1 + 1 = **7 races**.",
                keyIdea: "Prune aggressively after partial orderings: a horse can't be top-3 if 3 horses are already known to beat it. Only 5 candidates survive for the final race."
              },
              {
                title: "Infinite Sequence",
                difficulty: "medium",
                tags: ["algebra", "limits"],
                statement: "If $x^{x^{x^{x^{\\cdots}}}} = 2$ (an infinite power tower), what is $x$?",
                hint: "The exponent tower above the base is itself the same infinite tower.",
                solution: "**The trick:** an infinite tower contains a copy of *itself*. Look at the exponent sitting on the bottom $x$ — it's $x^{x^{x^{\\cdots}}}$, which is the **same** infinite tower again. And we're told the whole tower equals 2, so that exponent equals 2 too.\n\nSo the giant expression collapses to one line:\n$$x^{\\big(x^{x^{\\cdots}}\\big)} = x^{2} = 2.$$\n\nSolve $x^2 = 2$: $x = \\sqrt{2} \\approx 1.414$.\n\n*(Sanity note: this self-substitution only works because the tower converges, which it does for bases up to $e^{1/e}\\approx 1.44$ — and $\\sqrt2$ is safely under that.)*",
                keyIdea: "Self-similarity: an infinite recursive structure contains a copy of itself, so you can substitute the known value back in and collapse it to a simple equation."
              }
            ]
          },
          {
            id: "2.3",
            title: "Thinking Out of the Box",
            problems: [
              {
                title: "Box Packing (53 Bricks)",
                difficulty: "hard",
                tags: ["coloring", "parity", "3D"],
                statement: "Can you pack 53 bricks of dimensions 1×1×4 into a 6×6×6 box?",
                hint: "This is the 3D version of the classic chessboard-coloring problem. Color the box with 2×2×2 cubes in two colors.",
                solution: "**Answer: No.** Volume alone *allows* it — 53 bricks occupy $53 \\times 4 = 212$ units, and the box holds $216$ — so the obstruction must be subtler. This is the classic chessboard-coloring trick, lifted into 3D.\n\n**Set up the coloring.** Chop the $6\\times6\\times6$ box into 27 small **$2\\times2\\times2$ cubes** (3 along each edge). Color these 27 cubes like a 3D checkerboard, alternating two colors. You can't split 27 evenly, so you get **14 cubes of one color and 13 of the other**.\n\n**The crucial fact.** Place any $1\\times1\\times4$ brick. Because it's 4 long and the colored cubes are 2 wide, the brick always spans two adjacent small cubes — covering **2 units in a 'black' cube and 2 units in a 'white' cube**. So *every* brick eats equal amounts of each color.\n\n**Count the scarce color.** The minority color totals $13 \\times 8 = 104$ unit-cells. Each brick needs 2 minority-color cells, so at most $104 / 2 = 52$ bricks can fit. The **53rd brick has no minority-color room left** — impossible.\n\nSo 53 bricks of size $1\\times1\\times4$ **cannot** be packed into the $6\\times6\\times6$ box.",
                keyIdea: "Coloring/parity invariant in 3D: choose a coloring that every piece must respect equally, then count the scarce color to derive an upper bound."
              },
              {
                title: "Calendar Cubes",
                difficulty: "medium",
                tags: ["combinatorics", "lateral thinking"],
                statement: "You have two cubes (dice). You place a single digit on each of the 6 faces of each cube so that, by arranging the two cubes side by side, you can show every day of the month from 01 to 31. You may flip cubes. What digits go on each cube?",
                hint: "You need to display 11 and 22, so both cubes need a 1 and a 2. You have only 12 faces for 10 digits — be clever.",
                solution: "To show 11 and 22, **both** cubes must carry a **1** and a **2**. To show single-digit days as 0X, both cubes must also carry a **0**.\n\nThat uses 3 faces on each cube (0, 1, 2), leaving 3 faces per cube (6 total) for the digits 3, 4, 5, 6, 7, 8, 9 — that's 7 digits for 6 faces. The trick: **a 6 can be flipped to serve as a 9!** So you only need to place 3,4,5,6,7,8 and reuse 6 as 9.\n\n- **Cube 1:** 0, 1, 2, 3, 4, 5\n- **Cube 2:** 0, 1, 2, 6, 7, 8 (with 6 also used as 9)",
                keyIdea: "Out-of-the-box move: a physical 6 rotated 180° becomes a 9, freeing up a face. Forced constraints (need two 0s, 1s, 2s) come first; then exploit symmetry."
              },
              {
                title: "Door to Offer",
                difficulty: "easy",
                tags: ["logic", "self-reference"],
                statement: "Two doors: one leads to the job offer, the other to the exit. A guard stands at each. One guard always lies, the other always tells the truth (you don't know who is who). You may ask **one** guard **one** yes/no question. What do you ask to find the offer door?",
                hint: "Make the answer pass through both guards so the lie cancels out.",
                solution: "Ask either guard: **“Would the *other* guard say that *your* door leads to the offer?”**\n\n- If the answer is **yes**, choose the **other** door.\n- If **no**, choose this guard's door.\n\nWhy it works: the question routes through both a truth-teller and a liar exactly once, so the lie is always flipped. Either the truth-teller honestly reports the liar's lie, or the liar lies about the truth — both give the *wrong* answer about the door, which you then invert.",
                keyIdea: "Self-referential question design: chain the answer through both an honest and a dishonest source so their behaviors compose into a predictable (invertible) result."
              },
              {
                title: "Message Delivery",
                difficulty: "easy",
                tags: ["logic", "lateral", "protocol"],
                statement: "You must send a document to a colleague via an insecure messenger. Anything in an **unlocked** box gets stolen. You both have padlocks and keys, but you can only send a key inside an unlocked box (which would be stolen). How do you securely deliver the document?",
                hint: "You can put more than one lock on the box.",
                solution: "1. **You** put the document in a box, lock it with **your** padlock, and send it.\n2. **Colleague** adds **their own** padlock and sends it back (now double-locked).\n3. **You** remove **your** lock and send it again (still locked by your colleague's padlock).\n4. **Colleague** removes their lock and opens the box.\n\nNo key ever travels in an unlocked box.",
                keyIdea: "Layered locking — the box is never unprotected in transit. (This is the intuition behind Diffie–Hellman-style key exchange.)"
              },
              {
                title: "Last Ball",
                difficulty: "medium",
                tags: ["invariant", "parity"],
                statement: "A bag has 20 blue balls and 14 red balls. Repeatedly draw 2 balls: if same color, add a **blue** ball (from an unlimited supply); if different colors, add a **red** ball back. (You discard the two drawn appropriately.) What color is the last remaining ball? What if the bag starts with 20 blue and 13 red?",
                hint: "Track how the count of red balls changes at each step.",
                solution: "**The strategy:** don't simulate the chaos — find a quantity that *never changes* (an **invariant**). Watch what each move does to the number of **red** balls:\n\n| You draw | You add | Red count changes by |\n|---|---|---|\n| two blues | a blue | 0 |\n| two reds | a blue | **−2** |\n| one red + one blue | a red | 0 (the red is put back) |\n\nEvery move changes the red count by either 0 or −2 — so the **parity (odd/even) of the red count never flips**. That single fact decides the ending, because the last ball is red exactly when an odd number of reds survives:\n\n- **Start: 20 blue, 14 red.** 14 is **even** → reds stay even → can drain to 0 → the **last ball is blue**.\n- **Start: 20 blue, 13 red.** 13 is **odd** → reds stay odd → can never hit 0 → the **last ball is red**.",
                keyIdea: "Find a conserved quantity (here the parity of red balls) that the operations never change. Invariants instantly determine end-states."
              },
              {
                title: "Light Switches",
                difficulty: "easy",
                tags: ["information", "lateral"],
                statement: "One light bulb in a room, and four switches outside; exactly one controls the bulb. All start off. You may flip switches however you like, but may enter the room only **once**. How do you find the correct switch?",
                hint: "A bulb gives you more than just on/off — it also gets hot.",
                solution: "Use **two** binary signals: on/off **and** hot/cold (a bulb that was on becomes warm).\n\n1. Turn on **switch 1 and switch 2**; leave them for several minutes.\n2. Turn **off switch 2**, turn **on switch 3**, leave switch 4 off.\n3. Enter the room and feel the bulb:\n   - **On & hot** → switch 1\n   - **Off & hot** → switch 2\n   - **On & cold** → switch 3\n   - **Off & cold** → switch 4",
                keyIdea: "Extract a second bit of information from a physical side-channel (heat). Two binary states distinguish 2×2 = 4 cases in a single observation."
              },
              {
                title: "Quant Salary",
                difficulty: "easy",
                tags: ["protocol", "privacy", "lateral"],
                statement: "Eight quants want to compute their **average** salary without anyone revealing their own salary to the others. How?",
                hint: "Pass a running total around the circle, but mask the very first number.",
                solution: "The first quant picks a large **random number R** (secret), adds his salary, and passes the sum to the second quant. Each subsequent quant adds their own salary and passes it on. After the eighth quant adds their salary, the total comes back to the first quant, who **subtracts R** and divides by 8 to get the average — and announces it.\n\nNo one sees any individual salary: every number passed is masked by R (and others' salaries) until the very end. This is a real, used technique for **secure aggregation** (e.g., sharing anonymized fund-position data).",
                keyIdea: "Additive masking with a secret offset that only the originator can remove — a simple secure multi-party computation protocol."
              }
            ]
          },
          {
            id: "2.4",
            title: "Application of Symmetry",
            problems: [
              {
                title: "Coin Piles",
                difficulty: "medium",
                tags: ["symmetry", "invariant"],
                statement: "Blindfolded in a room, you're told there are 1000 coins on the floor: 980 are tails-up and 20 are heads-up. You can't feel which side is up, but you can move coins and flip any you choose. Separate the coins into two piles, each with the **same number of heads**.",
                hint: "Pick any 20 coins for one pile, then flip all of them.",
                solution: "**The puzzle's twist:** you can't feel which way a coin faces, so you can't *aim*. The escape is to find a move that forces the two piles equal **no matter what** you happened to grab. Flipping is that move.\n\nThere are 20 heads total. **Scoop any 20 coins into pile A**; the other 980 form pile B.\n\nSay pile A happens to contain $m$ heads (you have no idea what $m$ is). Then it also has $20 - m$ tails, and pile B holds the **remaining** $20 - m$ heads.\n\nNow **flip every coin in pile A**:\n- its $m$ heads become tails,\n- its $20 - m$ tails become **heads**.\n\nSo pile A now shows $20 - m$ heads — which is *exactly* the number of heads in pile B. **The two piles match**, and it worked for every possible $m$, even though you never knew a single coin's orientation.",
                keyIdea: "Symmetry through flipping: isolate exactly as many coins as there are heads, then flip the pile to convert its (unknown) tail-count into the matching head-count."
              },
              {
                title: "Mislabeled Bags",
                difficulty: "easy",
                tags: ["logic", "deduction"],
                statement: "Three bags of fruit: one has apples, one has oranges, one is mixed. Each bag is labeled (apple / orange / mix) but **all three labels are wrong**. By drawing fruit from bags, what's the minimum number of fruits you must inspect to correctly label all bags?",
                hint: "Use the fact that ALL labels are wrong. Pick from the bag labeled 'mix'.",
                solution: "**One fruit.** Draw a single fruit from the bag **labeled 'mix'**. Since all labels are wrong, this bag is **not** mixed — it's pure apple or pure orange.\n\n- If you draw an **apple**, this bag is the apple bag.\n- Now the bag labeled 'apple' can't be apple (wrong label) and can't be the apple bag (already found) — so it's the **mix** bag, and the last bag is **orange**.\n\nOne draw fully determines all three.",
                keyIdea: "Exploit the 'all wrong' constraint: sampling the bag whose label rules out the most possibilities collapses the whole puzzle in one move."
              },
              {
                title: "Wise Men (50 in a Dungeon)",
                difficulty: "hard",
                tags: ["protocol", "symmetry"],
                statement: "A sultan holds 50 wise men. A glass starts bottom-down. Each minute the sultan randomly calls one wise man (possibly infinitely often), who may flip the glass over or not. When a wise man correctly declares that **all 50 have been called at least once**, everyone goes free; if wrong, all die. Wise men can't see or communicate except via the glass. Design a strategy.",
                hint: "Designate one special 'counter' (spokesman) who is the only one allowed to count. The other 49 are symmetric.",
                solution: "**The problem:** the glass is the *only* channel of communication, and it holds just one bit (up or down). You need to turn that single bit into a reliable **counter** of how many distinct people have been called. The fix is to make one person the dedicated tally-keeper and have everyone else 'raise a flag' exactly once.\n\nAppoint one **spokesman** (the counter). Because the other 49 are interchangeable, they all follow the *same* rule:\n\n- **Each ordinary man:** the **first time** he's called and finds the glass **down**, he flips it **up** — this is him signalling \"I've been here\" exactly once. After he's done that one time, he never touches the glass again (and if it's already up when he's called, he leaves it).\n- **The spokesman:** whenever he's called and finds the glass **up**, he flips it back **down** and adds **1** to his private count. (If it's down, he does nothing.)\n\nWhy it works: each ordinary man can raise the glass *at most once ever*, and only the spokesman lowers it. So every 'up → down' the spokesman performs corresponds to a **distinct new person** having been called. When his count reaches **49**, all 49 others have signalled — plus himself — so all 50 have been called. He safely declares everyone free.",
                keyIdea: "Break symmetry by electing a single counter; make every other agent identical and able to signal 'I've been here' exactly once. The counter tallies unique signals."
              }
            ]
          },
          {
            id: "2.5",
            title: "Series Summation",
            note: "Gauss's trick: pair the first and last terms. $\\sum_{n=1}^{N} n = \\tfrac{N(N+1)}{2}$, $\\sum n^2 = \\tfrac{N(N+1)(2N+1)}{6}$.",
            problems: [
              {
                title: "Clock Pieces",
                difficulty: "easy",
                tags: ["series", "sum"],
                statement: "A clock face (numbered 1–12) falls and breaks into three pieces such that the numbers on each piece add up to the **same** sum. What numbers are on each piece?",
                hint: "Find the total, divide by 3 — then don't assume each piece is a neat contiguous arc.",
                solution: "Total of 1..12 is $\\tfrac{12 \\cdot 13}{2} = 78$, so each piece must sum to $78/3 = 26$.\n\nMany people get stuck assuming each piece is a **contiguous** run of numbers. Drop that assumption (a real break can give irregular pieces) and a valid split appears:\n\n- **{5, 6, 7, 8}** = 26\n- **{1, 2, 11, 12}** = 26\n- **{3, 4, 9, 10}** = 26\n\n(The 'aha' is realizing the pieces needn't each be a single arc.)",
                keyIdea: "Compute the total with Gauss's formula and divide by 3. The real trick is dropping the unstated assumption that each piece must be a contiguous arc."
              },
              {
                title: "Missing Integers",
                difficulty: "medium",
                tags: ["series", "power sums"],
                statement: "You have 98 distinct integers from 1 to 100. What's a good way to find the two missing integers?",
                hint: "Compare both the sum and the sum of squares against their known totals.",
                solution: "**The idea:** two unknowns ($x$ and $y$, the missing numbers) need two independent equations. You can manufacture them by comparing what the totals *should* be against what they *actually* are.\n\nLet $z_i$ be the 98 numbers you have. Use the known closed forms for $1$ to $100$:\n\n**Equation 1 (the sum):**\n$$x + y = \\frac{100\\cdot 101}{2} - \\sum_i z_i.$$\n\n**Equation 2 (the sum of squares):**\n$$x^2 + y^2 = \\frac{100\\cdot 101\\cdot 201}{6} - \\sum_i z_i^2.$$\n\nNow you have $x+y$ (call it $S$) and $x^2+y^2$ (call it $Q$). From $x+y=S$ get $y = S - x$, substitute into the second equation, and you get a single quadratic in $x$ — solve it for the two missing numbers.\n\nThis only sweeps the list a couple of times: **$O(n)$ time, $O(1)$ extra memory** — no sorting, no marking array needed.",
                keyIdea: "Two unknowns need two independent equations; the sum and the sum of squares (first two power sums) suffice."
              },
              {
                title: "Counterfeit Coins I",
                difficulty: "medium",
                tags: ["weighing", "encoding"],
                statement: "There are 10 bags with 100 identical-looking coins each. In all but one bag, each coin weighs 10 g. In the counterfeit bag every coin weighs either 9 g or 11 g (all the same, you're told only that they differ). Using a **digital scale** just **once**, identify the counterfeit bag.",
                hint: "Take a different number of coins from each bag so the deviation reveals which bag.",
                solution: "**The idea:** you only get *one* number from the scale, so you need to make each bag leave a *different fingerprint* on that number. Do it by taking a different quantity from each bag.\n\nTake **1 coin from bag 1, 2 from bag 2, 3 from bag 3, …, 10 from bag 10** — that's $1+2+\\cdots+10 = 55$ coins. If every coin were genuine (10 g), they'd weigh $550$ g exactly.\n\nNow suppose bag $i$ is the counterfeit one. You took $i$ of its coins, and each is off by $\\pm 1$ g, so the total is off by exactly $\\pm i$ grams:\n$$\\text{reading} = 550 \\pm i.$$\n\nRead the deviation: $|\\text{reading} - 550|$ **is the bag number**, and the **sign** tells you whether that bag's coins are light (9 g) or heavy (11 g). One weighing, fully solved.",
                keyIdea: "Encode each bag with a unique multiplier (distinct coin counts) so a single measurement carries a recoverable signature of which bag deviated."
              },
              {
                title: "Glass Balls (Egg Drop)",
                difficulty: "medium",
                tags: ["optimization", "search", "series"],
                statement: "You have two identical glass balls and a 100-story building. A ball breaks if dropped from floor X or above, and survives below X. Find the strategy that **minimizes the number of drops in the worst case** to determine X.",
                hint: "If your first ball can be dropped at most N times, the gaps between test floors should shrink by 1 each time.",
                solution: "**Why not just split in half?** With *one* ball you'd have to go floor-by-floor (a break ends you). The *second* ball buys you the right to take big jumps — but once it breaks, the first ball must crawl through the floors below it one at a time. The art is choosing jumps so the worst case is the same no matter where $X$ hides.\n\n**The balancing trick.** Suppose your plan uses at most $N$ drops in the worst case. Drop ball 1 at floor $N$ first. If it **breaks**, ball 2 must check floors $1$ to $N-1$ one by one — that's up to $N-1$ more drops, $N$ total. ✓ If it **survives**, you've spent 1 drop, so the next jump can only afford $N-1$ more — go up by $N-1$ floors (to floor $N + (N-1)$). Keep shrinking the jump by 1 each time.\n\nThe floors you can cover this way are $N + (N-1) + (N-2) + \\cdots + 1 = \\tfrac{N(N+1)}{2}$. To reach all 100 floors you need\n$$\\frac{N(N+1)}{2} \\ge 100 \\;\\Rightarrow\\; N = 14 \\;\\;(\\text{since } \\tfrac{14\\cdot15}{2}=105\\ge100).$$\n\n**Plan:** drop first at floor **14**; if it survives, 27, then 39, 50, … (jumps of 14, 13, 12, …). The moment a ball breaks, crawl upward from the last safe floor with ball 2. **Worst case: 14 drops.**",
                keyIdea: "Balance the two failure branches: the triangular-number sum $\\tfrac{N(N+1)}{2} \\ge 100$ equalizes the worst case across all starting floors."
              }
            ]
          },
          {
            id: "2.6",
            title: "The Pigeon Hole Principle",
            note: "If $n$ pigeons occupy fewer than $n$ holes, some hole has ≥2 pigeons. Generalized: $mn+1$ pigeons in $n$ holes ⟹ some hole has ≥ $m+1$.",
            problems: [
              {
                title: "Matching Socks",
                difficulty: "easy",
                tags: ["pigeonhole"],
                statement: "A drawer has 2 red, 20 yellow and 31 blue socks. In the dark, what's the minimum number of socks you must grab to **guarantee** a matching pair (same color)?",
                hint: "There are only 3 colors (3 holes).",
                solution: "There are 3 colors = 3 'holes'. By the pigeonhole principle, grabbing **4** socks guarantees that two share a color. (Three socks could be one of each color; the fourth must repeat one.)",
                keyIdea: "With $k$ categories, $k+1$ items guarantee a repeat."
              },
              {
                title: "Handshakes",
                difficulty: "easy",
                tags: ["pigeonhole"],
                statement: "At a party you meet 25 team members. Each shakes hands with some number of others. Without knowing the totals, can you be **certain** that at least two people shook the same number of hands?",
                hint: "26 people, each shakes 0 to 25 hands — but 0 and 25 can't both occur.",
                solution: "Including you, there are **26 people**. Each person shook between **0 and 25** hands — that's 26 possible values, seemingly one per person. But **0** (shook no one) and **25** (shook everyone) cannot both occur: if someone shook all 25 others, nobody shook zero. So only 25 distinct values are actually possible for 26 people → by pigeonhole, **at least two people shook the same number of hands**.",
                keyIdea: "Pigeonhole with a subtle exclusion: two of the 'holes' (0 and max) are mutually exclusive, shrinking the count below the number of people."
              },
              {
                title: "Have We Met Before?",
                difficulty: "hard",
                tags: ["pigeonhole", "Ramsey"],
                statement: "Show that at a party of 6 people, either at least 3 of them all met each other before, or at least 3 of them are mutual strangers.",
                hint: "Fix one person; by pigeonhole they have ≥3 acquaintances or ≥3 strangers among the other 5.",
                solution: "**Setup.** Think of each pair of people as a link colored either 'friends' (met before) or 'strangers'. We want to show *some* triangle of three people is all one color.\n\n**Step 1 — pin down one person.** Pick any person P. P has 5 links to the others, each friend-or-stranger. Splitting 5 links into 2 colors, **pigeonhole** forces at least $\\lceil 5/2 \\rceil = 3$ of them to be the *same* color. Say P has **3 friends**: A, B, C. (The all-strangers case is identical by symmetry.)\n\n**Step 2 — look inside that trio.** Consider the three links *among* A, B, C:\n- If **any one** of those pairs are friends — say A–B — then **P, A, B** are three mutual friends. ✓\n- If **none** of them are friends, then A, B, C are **three mutual strangers**. ✓\n\nEither way a monochromatic triangle appears, so one of the two conclusions always holds. (This proves the Ramsey number $R(3,3) = 6$ — 6 people always force such a trio, 5 don't.)",
                keyIdea: "Pigeonhole forces a monochromatic majority around one vertex; then a single case split on that trio closes the argument. Foundational Ramsey theory."
              },
              {
                title: "Ants on a Square",
                difficulty: "medium",
                tags: ["pigeonhole", "geometry"],
                statement: "There are 51 ants on a unit square (side length 1). Show that some glass of radius 1/7 placed somewhere on the square can cover at least **3** ants.",
                hint: "Divide the square into 25 smaller squares.",
                solution: "Partition the unit square into a 5×5 grid of **25 small squares** (side 1/5). With 51 ants in 25 cells, by the generalized pigeonhole principle some cell contains at least $\\lceil 51/25 \\rceil = 3$ ants.\n\nA small square of side 1/5 has diagonal $\\tfrac{\\sqrt 2}{5} \\approx 0.283$, so it fits inside a circle of radius $\\tfrac{\\sqrt2}{10} \\approx 0.141 < \\tfrac{1}{7} \\approx 0.143$. So a glass of radius 1/7 can cover that whole small square — and thus its ≥3 ants.",
                keyIdea: "Generalized pigeonhole gives a crowded cell; a geometric bound shows the target shape fits the cell."
              },
              {
                title: "Counterfeit Coins II",
                difficulty: "hard",
                tags: ["weighing", "encoding"],
                statement: "There are 5 bags of 100 coins each. A coin weighs 9, 10, or 11 g. Each bag is uniform but you don't know which type. Using a digital scale, how many weighings are needed to determine the coin type of **every** bag?",
                hint: "Start with the 1-bag and 2-bag versions. For each bag, pick coin counts whose weighted deviations never collide.",
                solution: "**One weighing** is enough. This is the previous problem turned up a notch: now *every* bag might be off, and in either direction ($-1$, $0$, or $+1$ gram per coin relative to 10 g). So each bag has **three** possible states — that's a base-3 (ternary) signal, and powers of 3 are exactly the weights that keep all combinations separable.\n\nTake **1, 3, 9, 27, 81** coins from bags 1–5. Relative to all-genuine, bag $i$ shifts the total by\n$$c_i \\times \\{-1, 0, +1\\}, \\quad c_i \\in \\{1, 3, 9, 27, 81\\}.$$\n\nBecause each weight is more than twice the sum of all smaller ones, no two different combinations of $\\{-1,0,+1\\}$ choices can ever produce the same total — this is **balanced ternary**, where every integer has a unique representation. So the single deviation you read off the scale decodes uniquely into the state of **all five bags at once**.",
                keyIdea: "Balanced ternary encoding: powers of 3 as multipliers make the $\\{-1,0,+1\\}$ deviations of each bag uniquely recoverable from a single sum."
              }
            ]
          },
          {
            id: "2.7",
            title: "Modular Arithmetic",
            problems: [
              {
                title: "Prisoner Problem (100 Hats)",
                difficulty: "hard",
                tags: ["parity", "modular", "protocol"],
                statement: "100 prisoners stand in a line; each wears a red or blue hat and can see everyone ahead but not their own or those behind. Starting from the back, each guesses their own hat color (everyone hears the guesses). A correct guess means freedom. What strategy maximizes guaranteed survivors? Then: what if there are **3** colors?",
                hint: "The first prisoner sacrifices himself to encode the parity of red hats he sees.",
                solution: "**At least 99 of the 100 can be guaranteed.** The trick is that the very first guesser (the one at the back, who sees all 99 others) spends his own guess to broadcast a *checksum* that lets everyone ahead solve for their own hat.\n\n**Two colors.** Agree in advance: the back prisoner says **\"red\" if he sees an odd number of red hats, \"blue\" if even** — i.e. he announces the *parity* of reds ahead of him. He himself is just guessing (50/50 — he's the one we might lose).\n\nNow every other prisoner can deduce their own hat exactly. When it's your turn you know:\n- the parity the back prisoner announced,\n- the reds you *see* ahead of you,\n- the red guesses *called out behind* you.\n\nThose three together pin down whether *your* hat must be red or blue to keep the parity consistent. So all 99 ahead are saved. ✓\n\n**Three colors** (code red = 0, green = 1, blue = 2). Same idea with arithmetic instead of parity: the back prisoner announces the **sum of all hats he sees, mod 3**. Each later prisoner subtracts (the hats they see ahead + the colors already called behind) from that announced total, mod 3 — what's left is their own color. Again **99 guaranteed**.",
                keyIdea: "The first guesser sacrifices himself to broadcast a checksum (parity mod 2, or sum mod 3). Everyone downstream solves for their own value from the running total."
              },
              {
                title: "Division by 9",
                difficulty: "easy",
                tags: ["number theory", "modular"],
                statement: "Prove the rule: an integer is divisible by 9 if and only if the sum of its digits is divisible by 9.",
                hint: "Each power of 10 leaves remainder 1 when divided by 9.",
                solution: "Write $a = a_n 10^n + a_{n-1}10^{n-1} + \\cdots + a_1 10 + a_0$. Note $10^k - 1 = \\underbrace{99\\cdots9}_{k}$ is divisible by 9 for all $k$.\n\nLet $b = a - (a_n + a_{n-1} + \\cdots + a_0)$ (the number minus its digit sum). Then\n$$b = a_n(10^n - 1) + a_{n-1}(10^{n-1} - 1) + \\cdots + a_1(10 - 1),$$\nand every term is divisible by 9, so $b$ is divisible by 9. Therefore $a$ is divisible by 9 **iff** the digit sum is. (Similarly, alternating digit sums give the divisibility rule for 11.)",
                keyIdea: "Since $10 \\equiv 1 \\pmod 9$, every power of ten is $\\equiv 1$, so a number is congruent to its digit sum mod 9."
              },
              {
                title: "Chameleon Colors",
                difficulty: "medium",
                tags: ["invariant", "modular"],
                statement: "An island has 13 red, 15 green, and 17 blue chameleons. When two chameleons of different colors meet, both change to the **third** color. Can they ever all become the same color?",
                hint: "Consider the counts modulo 3.",
                solution: "**Answer: No.** When something *can't* happen, look for an invariant — a quantity the move never changes. Here, watch the counts **modulo 3**.\n\nStart: $(R, G, B) = (13, 15, 17) \\equiv (1, 0, 2) \\pmod 3$. Notice the three residues are **all different**.\n\nNow look at one meeting: two colors each lose one chameleon and the third gains two. So the changes are $(-1, -1, +2)$ in some order. But mod 3, $-1 \\equiv +2 \\equiv 2$, so *every* count changes by the **same** amount ($+2$) mod 3:\n$$(1,0,2) \\to (1{+}2,\\,0{+}2,\\,2{+}2) = (0, 2, 1) \\pmod 3 \\;-\\; \\text{still all different.}$$\n\nBecause all three shift equally, the *gaps* between the residues never change — they stay all-distinct forever. But 'all one color' means two counts are 0 and equal mod 3 — residues **not** all distinct. That state is unreachable. So the chameleons can **never** all become the same color.",
                keyIdea: "Invariant mod 3: the operation preserves the differences of the counts modulo 3, so an all-same configuration (impossible from distinct residues) is unreachable."
              }
            ]
          },
          {
            id: "2.8",
            title: "Math Induction",
            problems: [
              {
                title: "Coin Split Problem",
                difficulty: "medium",
                tags: ["induction", "invariant"],
                statement: "Split 1000 coins into two piles of $x$ and $y$ coins; record the product $xy$. Repeatedly split each pile further (recording the product each time) until every pile has 1 coin. Prove the **total of all recorded products** is the same regardless of how you split, and find it.",
                hint: "Try small cases (n = 2, 3, 4), spot the pattern, then prove by strong induction.",
                solution: "**Guess the pattern first.** Try tiny cases. Split 2 coins → only $1\\times1=1$, total **1**. Split 3 coins → $1\\times2=2$, then the pile of 2 splits for another 1, total **3**. The totals $0, 1, 3, 6, \\dots$ are the triangular numbers $\\tfrac{n(n-1)}{2}$ — and they don't seem to depend on *how* you split. Let's prove that.\n\n**Claim:** for $n$ coins the total is always $f(n) = \\tfrac{n(n-1)}{2}$, no matter the choices.\n\n**Proof by strong induction.** Base case $f(1) = 0$. For the step, the *first* split breaks $n$ coins into piles of $x$ and $n-x$, recording $x(n-x)$, after which the two piles are independent sub-games. So\n$$f(n) = x(n-x) + f(x) + f(n-x).$$\nAssume the formula holds for all sizes below $n$ and substitute:\n$$f(n) = x(n-x) + \\frac{x(x-1)}{2} + \\frac{(n-x)(n-x-1)}{2}.$$\nExpanding, all the $x$ terms cancel and this collapses to $\\tfrac{n(n-1)}{2}$ — **independent of $x$**, which is exactly the path-independence we wanted.\n\nFor 1000 coins: $f(1000) = \\tfrac{1000 \\cdot 999}{2} = \\mathbf{499{,}500}$.\n\n*(Neat reason why: $\\tfrac{n(n-1)}{2} = \\binom{n}{2}$ counts pairs of coins — and the process 'separates' each pair exactly once.)*",
                keyIdea: "Strong induction confirms a path-independent invariant: the sum equals the number of distinct pairs, $\\binom{n}{2}$ (every pair of coins is 'separated' exactly once)."
              },
              {
                title: "Chocolate Bar Problem",
                difficulty: "easy",
                tags: ["induction", "invariant"],
                statement: "A chocolate bar is an $m \\times n$ grid of squares. Each 'break' splits one rectangular piece into two rectangles along a grid line. What is the minimum number of breaks to reduce the whole bar into $mn$ individual 1×1 squares?",
                hint: "Count how the number of pieces changes with each break.",
                solution: "**Always $mn - 1$ breaks**, regardless of order. Each break increases the number of pieces by exactly **1**. You start with 1 piece and must reach $mn$ pieces, so you need exactly $mn - 1$ breaks. (Provable by induction, but the invariant makes it immediate.)\n\nFor a 6×8 bar: $48 - 1 = 47$ breaks.",
                keyIdea: "Invariant: 'pieces' goes up by 1 per break, so the count of breaks is fixed at (final pieces − 1) no matter the strategy."
              },
              {
                title: "Race Track (Gas Cans)",
                difficulty: "hard",
                tags: ["induction"],
                statement: "On a one-way circular track, $N$ gas cans are placed at various points; the total gas in them is exactly enough for one full loop. Your car starts empty and can hold unlimited gas, picking up cans as it passes. Prove there's always a starting position from which you can complete the full loop.",
                hint: "Start with N = 1, 2 and induct. Or: merge two adjacent cans.",
                solution: "**Prove it by induction on the number of cans $N$.**\n\n**Base case ($N = 1$):** the single can holds all the gas needed for the loop, so start there — done.\n\n**Inductive step:** assume any arrangement of $N-1$ cans (with just-enough total gas) has a valid start. Now take $N$ cans. \n\n*First, a key fact:* there must be **some** can that holds enough gas to reach the **next** can. Why? If every can fell short of its neighbor, then summed around the loop the total gas would be less than the total distance — but we're told they're exactly equal. Contradiction. So such a can, call it $i$, exists.\n\nNow **merge**: pour can $i+1$'s gas back into can $i$ and delete can $i+1$ (we know the car can cover that gap anyway). This is a legal $N-1$-can arrangement with the same total gas, so by the inductive hypothesis it has a valid starting point. **That same starting point works for the original $N$ cans** — when the car reaches $x_i$ it has at least as much gas as in the merged version, so it sails past $x_{i+1}$ and finishes the loop. ∎\n\n*(Quick alternative: track your running gas balance around the loop and start at the can right after the point where that balance hits its lowest value.)*",
                keyIdea: "Inductive merging: there's always a 'self-sufficient' can that can absorb its successor, shrinking $N$ while preserving feasibility."
              }
            ]
          },
          {
            id: "2.9",
            title: "Proof by Contradiction",
            problems: [
              {
                title: "Irrational Number (√2)",
                difficulty: "easy",
                tags: ["proof", "contradiction", "number theory"],
                statement: "Prove that $\\sqrt{2}$ is irrational.",
                hint: "Assume it's a fraction in lowest terms and derive a parity contradiction.",
                solution: "**The strategy of proof by contradiction:** assume the opposite of what you want, then show it forces something impossible. Here, assume $\\sqrt2$ *is* rational and watch it self-destruct.\n\nSuppose $\\sqrt2 = \\dfrac{m}{n}$ written in **lowest terms** — so $m$ and $n$ share no common factor (this is the assumption we'll blow up).\n\nSquare both sides: $2 = \\dfrac{m^2}{n^2}$, i.e.\n$$m^2 = 2n^2.$$\n\n- $m^2$ is twice something, so $m^2$ is **even**, which means **$m$ is even**. Write $m = 2x$.\n- Substitute: $(2x)^2 = 2n^2 \\Rightarrow 4x^2 = 2n^2 \\Rightarrow n^2 = 2x^2$. By the same logic, **$n$ is even** too.\n\nBut if both $m$ and $n$ are even, they share the factor 2 — **contradicting** \"lowest terms.\" The only thing we assumed was that $\\sqrt2$ is rational, so that must be false. Therefore $\\sqrt2$ is **irrational**. ∎",
                keyIdea: "Assume the negation (rational, in lowest terms), then derive that both numerator and denominator are even — a contradiction with the reduced-fraction assumption."
              },
              {
                title: "Rainbow Hats (7 Prisoners)",
                difficulty: "hard",
                tags: ["modular", "protocol", "contradiction"],
                statement: "7 prisoners each get a hat in one of 7 rainbow colors (repeats allowed). Each sees the other 6 hats but not their own; they can't communicate. All write down a guess simultaneously. If **at least one** guesses correctly, all go free. Find a strategy that guarantees freedom.",
                hint: "Code the colors 0–6. Make prisoner i guess so the total sum ≡ i (mod 7).",
                solution: "**The idea:** we only need *one* prisoner to be right, so spread their guesses across all 7 possibilities of one hidden quantity — the total. Then whatever the truth is, exactly one prisoner 'bet' on it.\n\nCode the colors $0, 1, \\dots, 6$. Each prisoner $i$ assumes *\"the sum of all 7 hats is $\\equiv i \\pmod 7$\"* and guesses his own hat accordingly: he sees the other six, so he picks $g_i$ making\n$$g_i + (\\text{sum of the six he sees}) \\equiv i \\pmod 7.$$\nSo prisoner 0 bets the total is $\\equiv 0$, prisoner 1 bets $\\equiv 1$, …, prisoner 6 bets $\\equiv 6$ — covering **all** residues.\n\nNow the *real* total $S = \\sum_j x_j$ has some actual residue $r = S \\bmod 7$, and $r$ is one of $0,\\dots,6$. **Prisoner $r$ bet on exactly the right total**, so his guess for his own hat is correct. Since $r$ always exists, at least one prisoner is always right → everyone goes free.\n\n*(Why it can't fail: if everyone were wrong, the true sum would have to dodge all 7 residues mod 7 at once — impossible, there are only 7.)*",
                keyIdea: "Cover all residues: each prisoner bets on a different value of the total sum mod 7, so whatever the real sum is, exactly the prisoner betting on that residue is correct."
              }
            ]
          }
        ]
      },

      // ---------- Chapters 3-7: scaffolded from the table of contents ----------
      {
        num: 3,
        title: "Calculus & Linear Algebra",
        blurb: "Limits, derivatives, integration, ODEs and matrix algebra — the analytical toolkit behind pricing and risk.",
        topics: [
          {
            id: "3.1",
            title: "Limits and Derivatives",
            note: "The derivative $f'(x)$ is the slope of the tangent / instantaneous rate of change. Master the chain, product, and quotient rules — plus the **logarithmic derivative** trick for powers-of-functions.",
            problems: [
              {
                title: "Basics of Derivatives",
                difficulty: "medium",
                tags: ["derivatives", "logarithmic differentiation"],
                statement: "What is the derivative of $y = x^{x}$ (and more generally $y = x^{x^{x}}$)?",
                hint: "When both the base and the exponent contain $x$, take logs of both sides first.",
                solution: "**The trick — logarithmic differentiation.** When the variable appears in *both* the base and the exponent, neither the power rule nor the exponential rule applies directly. Take $\\ln$ of both sides to turn the exponent into a product:\n$$y = x^x \\;\\Rightarrow\\; \\ln y = x\\ln x.$$\nDifferentiate both sides (chain rule on the left, product rule on the right):\n$$\\frac{1}{y}\\frac{dy}{dx} = \\ln x + x\\cdot\\frac1x = \\ln x + 1.$$\nSo\n$$\\frac{dy}{dx} = y(\\ln x + 1) = x^x(\\ln x + 1).$$\n\n**For the tower $y = x^{x^x}$:** same idea, $\\ln y = x^x \\ln x$. Differentiate the right side (it now needs the $x^x$ derivative we just found):\n$$\\frac1y\\frac{dy}{dx} = x^x(\\ln x + 1)\\ln x + x^x\\cdot\\frac1x \\;\\Rightarrow\\; \\frac{dy}{dx} = x^{x^x}\\Big(x^x(\\ln x+1)\\ln x + x^{x-1}\\Big).$$",
                keyIdea: "Logarithmic differentiation: take $\\ln$ to drop the exponent into a product, then differentiate implicitly. Essential whenever the variable is in both base and exponent."
              },
              {
                title: "Maximum and Minimum",
                difficulty: "easy",
                tags: ["optimization", "calculus"],
                statement: "How do you find and classify the extrema of a function $f(x)$? When is a critical point a max, a min, or neither?",
                hint: "Set the first derivative to zero, then use the second derivative (or sign changes) to classify.",
                solution: "**Step 1 — find critical points.** Extrema occur where the tangent is flat or undefined: solve $f'(x) = 0$ (and check points where $f'$ doesn't exist, plus the endpoints of the domain).\n\n**Step 2 — classify** each critical point $x_0$ with the **second derivative test**:\n- $f''(x_0) > 0$ → curve is concave up → **local minimum**.\n- $f''(x_0) < 0$ → concave down → **local maximum**.\n- $f''(x_0) = 0$ → inconclusive; fall back to checking the **sign change** of $f'$ around $x_0$ (− to + is a min, + to − is a max, no change is an inflection/saddle).\n\n**Step 3 — global extrema.** On a closed interval, compare $f$ at all critical points *and* the two endpoints; the largest/smallest wins. (Don't forget the endpoints — a common slip.)",
                keyIdea: "$f'=0$ locates candidates; the sign of $f''$ classifies them. For a global extremum on an interval, always also check the endpoints."
              },
              {
                title: "L'Hospital's Rule",
                difficulty: "medium",
                tags: ["limits", "L'Hospital"],
                statement: "How do you evaluate indeterminate limits like $\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$? Evaluate $\\lim_{x\\to 0}\\frac{\\sin x}{x}$ and $\\lim_{x\\to\\infty} x^{1/x}$.",
                hint: "L'Hospital: for $0/0$ or $\\infty/\\infty$, differentiate top and bottom separately. For exponent forms, take logs first.",
                solution: "**L'Hospital's rule:** if $\\lim \\frac{f}{g}$ is of the form $\\frac00$ or $\\frac{\\infty}{\\infty}$, then $\\lim\\frac{f}{g} = \\lim\\frac{f'}{g'}$ (when the latter exists) — differentiate numerator and denominator *separately* (not the quotient rule).\n\n**Example 1:** $\\lim_{x\\to0}\\frac{\\sin x}{x}$ is $\\frac00$. Differentiate top and bottom: $\\lim_{x\\to0}\\frac{\\cos x}{1} = 1$.\n\n**Example 2:** $\\lim_{x\\to\\infty} x^{1/x}$ is the indeterminate form $\\infty^0$. Take logs first: let $L = \\lim \\tfrac{\\ln x}{x}$, which is $\\frac{\\infty}{\\infty}$. L'Hospital gives $\\lim \\frac{1/x}{1} = 0$. Since $\\ln(\\text{answer}) = 0$, the limit is $e^0 = 1$.\n\n**Caution:** only apply it to genuine $\\frac00$ / $\\frac{\\infty}{\\infty}$ forms; for $0\\cdot\\infty$, $\\infty-\\infty$, or $1^\\infty$, first algebraically rearrange (or take logs) into a quotient.",
                keyIdea: "For $0/0$ or $\\infty/\\infty$, differentiate top and bottom. For exponent indeterminates ($\\infty^0$, $1^\\infty$), take logs to convert to a quotient first."
              }
            ]
          },
          {
            id: "3.2",
            title: "Integration",
            note: "Integration reverses differentiation and measures area. Core tools: substitution, integration by parts ($\\int u\\,dv = uv - \\int v\\,du$), and recognizing probability densities.",
            problems: [
              {
                title: "Basics of Integration",
                difficulty: "medium",
                tags: ["integration", "by parts"],
                statement: "What are the main integration techniques, and when do you use each? Illustrate with $\\int x e^{x}\\,dx$.",
                hint: "Substitution undoes the chain rule; integration by parts undoes the product rule.",
                solution: "Two workhorse techniques:\n\n**Substitution** (reverses the chain rule): spot an inner function $u = g(x)$ whose derivative also appears, and rewrite $\\int f(g(x))g'(x)\\,dx = \\int f(u)\\,du$. Use it when the integrand is a composite times the inner derivative.\n\n**Integration by parts** (reverses the product rule): $\\int u\\,dv = uv - \\int v\\,du$. Use it for products like (polynomial)×(exp/log/trig). Pick $u$ to be the part that *simplifies* when differentiated.\n\n**Example $\\int x e^x\\,dx$:** let $u = x$ (simplifies to 1) and $dv = e^x dx$ (so $v = e^x$):\n$$\\int x e^x\\,dx = x e^x - \\int e^x\\,dx = x e^x - e^x + C = e^x(x-1) + C.$$\n\n(A handy mnemonic for choosing $u$ in by-parts: **LIATE** — Logarithmic, Inverse-trig, Algebraic, Trig, Exponential — earlier in the list makes the better $u$.)",
                keyIdea: "Substitution undoes the chain rule; by-parts ($\\int u\\,dv = uv - \\int v\\,du$) undoes the product rule. Choose $u$ to be what simplifies under differentiation (LIATE)."
              },
              {
                title: "Applications of Integration",
                difficulty: "medium",
                tags: ["integration", "area", "average"],
                statement: "What can definite integrals compute? Find the area under one arch of $\\sin x$ and the average value of $\\sin x$ over $[0,\\pi]$.",
                hint: "Area is $\\int f\\,dx$; average value is $\\frac{1}{b-a}\\int_a^b f\\,dx$.",
                solution: "Definite integrals accumulate quantities: **area** under a curve, **average value** of a function, volumes, arc lengths, and (crucially for quant work) **probabilities and expectations**.\n\n**Area under one arch of $\\sin x$** over $[0,\\pi]$:\n$$\\int_0^\\pi \\sin x\\,dx = [-\\cos x]_0^\\pi = -\\cos\\pi + \\cos 0 = 1 + 1 = 2.$$\n\n**Average value** over $[0,\\pi]$ (total area divided by interval length):\n$$\\bar f = \\frac{1}{\\pi - 0}\\int_0^\\pi \\sin x\\,dx = \\frac{2}{\\pi} \\approx 0.637.$$\n\nThe average-value formula $\\frac{1}{b-a}\\int_a^b f\\,dx$ is the continuous analog of averaging a list — and it's exactly how you compute the mean of a continuous random variable.",
                keyIdea: "Definite integrals accumulate area, averages ($\\frac{1}{b-a}\\int f$), and expectations. The average value is the continuous version of a mean."
              },
              {
                title: "Expected Value Using Integration",
                difficulty: "medium",
                tags: ["integration", "expectation", "probability"],
                statement: "For a continuous random variable with density $f(x)$, how do you compute $E[X]$ and $E[g(X)]$? Find $E[X]$ for $X \\sim \\text{Unif}[0,1]$ and for an exponential with rate $\\lambda$.",
                hint: "$E[X] = \\int x f(x)\\,dx$; $E[g(X)] = \\int g(x) f(x)\\,dx$ over the support.",
                solution: "For a continuous variable, expectation is an integral against the density:\n$$E[X] = \\int_{-\\infty}^{\\infty} x\\,f(x)\\,dx, \\qquad E[g(X)] = \\int_{-\\infty}^{\\infty} g(x)\\,f(x)\\,dx.$$\n\n**Uniform $[0,1]$** ($f(x) = 1$ on $[0,1]$):\n$$E[X] = \\int_0^1 x\\,dx = \\tfrac12.$$\n\n**Exponential rate $\\lambda$** ($f(x) = \\lambda e^{-\\lambda x}$, $x\\ge 0$): integrate by parts,\n$$E[X] = \\int_0^\\infty x\\,\\lambda e^{-\\lambda x}\\,dx = \\frac{1}{\\lambda}.$$\n\nA useful alternative for non-negative variables (avoids by-parts): $E[X] = \\int_0^\\infty P(X > x)\\,dx$ — integrate the survival function. For the exponential, $\\int_0^\\infty e^{-\\lambda x}dx = 1/\\lambda$ immediately.",
                keyIdea: "Expectation is $\\int x f(x)\\,dx$ (and $E[g(X)] = \\int g\\,f$). For non-negative variables, $E[X] = \\int_0^\\infty P(X>x)\\,dx$ is often faster."
              }
            ]
          },
          {
            id: "3.3",
            title: "Partial Derivatives & Multiple Integrals",
            problems: [
              {
                title: "Partial Derivatives & Multiple Integrals",
                difficulty: "hard",
                tags: ["multiple integrals", "polar coordinates", "Gaussian"],
                statement: "Evaluate the Gaussian integral $\\int_{-\\infty}^{\\infty} e^{-x^2/2}\\,dx$.",
                hint: "Square it to get a double integral, then switch to polar coordinates.",
                solution: "There's no elementary antiderivative for $e^{-x^2/2}$, so use the classic **square-and-polar** trick. Call the integral $I$ and look at $I^2$ as a double integral over the plane:\n$$I^2 = \\left(\\int_{-\\infty}^{\\infty} e^{-x^2/2}dx\\right)\\left(\\int_{-\\infty}^{\\infty} e^{-y^2/2}dy\\right) = \\iint_{\\mathbb{R}^2} e^{-(x^2+y^2)/2}\\,dx\\,dy.$$\n\nNow switch to **polar coordinates** ($x = r\\cos\\theta$, $y = r\\sin\\theta$, $dx\\,dy = r\\,dr\\,d\\theta$), which makes $x^2 + y^2 = r^2$:\n$$I^2 = \\int_0^{2\\pi}\\int_0^\\infty e^{-r^2/2}\\,r\\,dr\\,d\\theta.$$\nThe inner integral is now elementary (substitute $u = r^2/2$): $\\int_0^\\infty e^{-r^2/2}r\\,dr = 1$. So $I^2 = \\int_0^{2\\pi} 1\\,d\\theta = 2\\pi$, giving\n$$I = \\sqrt{2\\pi}.$$\n\nThis is exactly why the standard normal density carries the $\\frac{1}{\\sqrt{2\\pi}}$ normalizing constant — so it integrates to 1.",
                keyIdea: "Square the 1-D Gaussian into a 2-D integral, then polar coordinates turn it elementary (the extra $r$ is the key). Result $\\sqrt{2\\pi}$ is the normal's normalizer."
              }
            ]
          },
          {
            id: "3.4",
            title: "Important Calculus Methods",
            note: "Taylor expansions approximate functions by polynomials; Newton's method finds roots by iterated tangents; Lagrange multipliers solve constrained optimization.",
            problems: [
              {
                title: "Taylor's Series",
                difficulty: "medium",
                tags: ["Taylor series", "approximation", "Euler's formula"],
                statement: "Write the Taylor series and use it to compute $i^i$ (where $i = \\sqrt{-1}$).",
                hint: "Taylor-expand $e^x$, $\\sin x$, $\\cos x$ to derive Euler's formula, then take logs.",
                solution: "**Taylor series** expands $f$ near $x_0$ as a polynomial built from its derivatives:\n$$f(x) = f(x_0) + f'(x_0)(x-x_0) + \\frac{f''(x_0)}{2!}(x-x_0)^2 + \\cdots$$\nThe famous expansions (about 0): $e^x = \\sum \\frac{x^n}{n!}$, $\\sin x = x - \\frac{x^3}{3!} + \\cdots$, $\\cos x = 1 - \\frac{x^2}{2!} + \\cdots$.\n\n**Euler's formula falls out:** substitute $x = i\\theta$ into the $e^x$ series and group real/imaginary terms — they reassemble into $\\cos\\theta$ and $\\sin\\theta$:\n$$e^{i\\theta} = \\cos\\theta + i\\sin\\theta.$$\n\n**Now compute $i^i$.** Write $i$ in exponential form: $i = e^{i\\pi/2}$. Then\n$$i^i = \\big(e^{i\\pi/2}\\big)^i = e^{i^2\\pi/2} = e^{-\\pi/2} \\approx 0.208.$$\nStrikingly, $i^i$ is a **real** number. (There are other values $e^{-\\pi/2 + 2\\pi k}$ from the multivaluedness of the complex log, but the principal one is $e^{-\\pi/2}$.)",
                keyIdea: "Taylor series of $e^x$ gives Euler's formula $e^{i\\theta}=\\cos\\theta+i\\sin\\theta$; writing $i = e^{i\\pi/2}$ makes $i^i = e^{-\\pi/2}$, a real number."
              },
              {
                title: "Newton's Method",
                difficulty: "medium",
                tags: ["root finding", "iteration"],
                statement: "Explain Newton's method for solving $f(x) = 0$, and use it to approximate $\\sqrt{2}$.",
                hint: "Follow the tangent line down to the x-axis, repeat. The update is $x_{n+1} = x_n - f(x_n)/f'(x_n)$.",
                solution: "**The idea:** to solve $f(x) = 0$, start at a guess, slide down the **tangent line** to where it crosses the x-axis, and use that as your next guess. The tangent at $x_n$ hits zero at\n$$x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}.$$\nNear a simple root it converges **quadratically** (the number of correct digits roughly doubles each step).\n\n**Approximating $\\sqrt2$:** solve $f(x) = x^2 - 2 = 0$, with $f'(x) = 2x$. The update simplifies beautifully:\n$$x_{n+1} = x_n - \\frac{x_n^2 - 2}{2x_n} = \\frac{x_n + 2/x_n}{2} \\;(\\text{the average of } x_n \\text{ and } 2/x_n).$$\nStart $x_0 = 1$: $x_1 = 1.5$, $x_2 = 1.41\\overline{6}$, $x_3 = 1.41421\\ldots$ — already accurate to 5 decimals in three steps. (This is the ancient 'Babylonian' square-root method.)",
                keyIdea: "Newton iterates $x_{n+1} = x_n - f(x_n)/f'(x_n)$ (tangent to the axis), converging quadratically. For $\\sqrt2$ it becomes 'average $x$ with $2/x$'."
              },
              {
                title: "Lagrange Multipliers",
                difficulty: "hard",
                tags: ["constrained optimization", "Lagrange"],
                statement: "How do Lagrange multipliers solve constrained optimization? Maximize $xy$ subject to $x + y = 10$.",
                hint: "At the optimum, the gradient of the objective is parallel to the gradient of the constraint: $\\nabla f = \\lambda\\nabla g$.",
                solution: "**The principle:** to optimize $f(x,y)$ subject to $g(x,y) = c$, note that at the constrained optimum the objective's gradient must be **parallel** to the constraint's gradient (otherwise you could slide along the constraint to improve). That gives $\\nabla f = \\lambda\\nabla g$ for some multiplier $\\lambda$ — combine with the constraint and solve.\n\n**Maximize $f = xy$ subject to $g = x + y = 10$:**\n$$\\nabla f = (y, x), \\quad \\nabla g = (1,1) \\;\\Rightarrow\\; y = \\lambda,\\; x = \\lambda \\;\\Rightarrow\\; x = y.$$\nPlug into the constraint $x + y = 10$: $x = y = 5$. Maximum value $xy = 25$.\n\nIntuition check: among all rectangles with fixed perimeter, the **square** has the largest area — exactly what we found ($x = y$). The multiplier $\\lambda$ also has meaning: it's the rate at which the optimum improves as you relax the constraint (the 'shadow price').",
                keyIdea: "Set $\\nabla f = \\lambda\\nabla g$ plus the constraint. $\\lambda$ is the shadow price — how much the optimum improves per unit of loosened constraint."
              }
            ]
          },
          {
            id: "3.5",
            title: "Ordinary Differential Equations",
            note: "Classify first: separable? linear? homogeneous vs. nonhomogeneous? The general solution of a linear ODE = (homogeneous solution) + (one particular solution).",
            problems: [
              {
                title: "Separable Differential Equations",
                difficulty: "easy",
                tags: ["ODE", "separable"],
                statement: "Solve a separable ODE. Example: $\\frac{dy}{dx} = ky$.",
                hint: "Get all the $y$'s on one side and all the $x$'s on the other, then integrate both sides.",
                solution: "An ODE is **separable** if you can algebraically split the variables — all $y$ on one side, all $x$ on the other — then integrate each side independently.\n\n**Example $\\frac{dy}{dx} = ky$** (exponential growth/decay):\n$$\\frac{dy}{y} = k\\,dx \\;\\Rightarrow\\; \\int\\frac{dy}{y} = \\int k\\,dx \\;\\Rightarrow\\; \\ln|y| = kx + C.$$\nExponentiate: $y = Ae^{kx}$, where $A = \\pm e^{C}$ is fixed by an initial condition (e.g. $y(0) = y_0 \\Rightarrow A = y_0$). So $y = y_0 e^{kx}$.\n\nThis single equation underlies continuous compounding, radioactive decay, and the drift term of geometric Brownian motion.",
                keyIdea: "Separate variables, integrate both sides. $\\frac{dy}{dx}=ky$ gives exponential $y = y_0 e^{kx}$ — the backbone of compounding and decay."
              },
              {
                title: "First-Order Linear Differential Equations",
                difficulty: "medium",
                tags: ["ODE", "integrating factor"],
                statement: "Solve a first-order linear ODE $\\frac{dy}{dx} + P(x)y = Q(x)$.",
                hint: "Multiply by an integrating factor $\\mu(x) = e^{\\int P\\,dx}$ so the left side becomes a perfect derivative.",
                solution: "A first-order linear ODE has the form $\\frac{dy}{dx} + P(x)y = Q(x)$. The trick is the **integrating factor** $\\mu(x) = e^{\\int P(x)\\,dx}$. Multiply through by $\\mu$ and the left side becomes exactly the derivative of a product:\n$$\\mu\\frac{dy}{dx} + \\mu P y = \\frac{d}{dx}\\big(\\mu y\\big) = \\mu Q.$$\nNow integrate both sides:\n$$\\mu(x)\\,y = \\int \\mu(x) Q(x)\\,dx + C \\;\\Rightarrow\\; y = \\frac{1}{\\mu(x)}\\left(\\int \\mu Q\\,dx + C\\right).$$\n\nThe whole method exists to engineer the left-hand side into a single $\\frac{d}{dx}(\\mu y)$ so you can just integrate.",
                keyIdea: "Multiply by $\\mu = e^{\\int P\\,dx}$ to collapse the left side into $\\frac{d}{dx}(\\mu y)$, then integrate. The integrating factor is the whole game."
              },
              {
                title: "Homogeneous Linear Equations",
                difficulty: "medium",
                tags: ["ODE", "characteristic equation"],
                statement: "Solve a constant-coefficient homogeneous linear ODE, e.g. $y'' - 3y' + 2y = 0$.",
                hint: "Guess $y = e^{rx}$; you get a characteristic (algebraic) equation in $r$.",
                solution: "For a constant-coefficient linear ODE like $ay'' + by' + cy = 0$, **guess $y = e^{rx}$**. Substituting turns the differential equation into an algebraic **characteristic equation** $ar^2 + br + c = 0$.\n\n**Example $y'' - 3y' + 2y = 0$:** characteristic equation $r^2 - 3r + 2 = 0 \\Rightarrow (r-1)(r-2) = 0$, roots $r = 1, 2$. Each root gives a solution, and the general solution is their linear combination:\n$$y = c_1 e^{x} + c_2 e^{2x}.$$\n\n**Root cases to know:**\n- **Distinct real** roots $r_1, r_2$: $y = c_1 e^{r_1 x} + c_2 e^{r_2 x}$.\n- **Repeated** root $r$: $y = (c_1 + c_2 x)e^{rx}$.\n- **Complex** roots $\\alpha \\pm i\\beta$: $y = e^{\\alpha x}(c_1\\cos\\beta x + c_2\\sin\\beta x)$ — oscillation from the imaginary part.",
                keyIdea: "Guess $e^{rx}$ to get a characteristic polynomial; its roots (real/repeated/complex) dictate the solution form. Complex roots ⇒ oscillation."
              },
              {
                title: "Nonhomogeneous Linear Equations",
                difficulty: "medium",
                tags: ["ODE", "particular solution"],
                statement: "Solve a nonhomogeneous linear ODE, e.g. $y'' - 3y' + 2y = x$.",
                hint: "General solution = homogeneous solution + any one particular solution.",
                solution: "**The structure:** for $ay'' + by' + cy = R(x)$, the general solution is\n$$y = \\underbrace{y_h}_{\\text{homogeneous (RHS}=0)} + \\underbrace{y_p}_{\\text{one particular solution}}.$$\nYou already know how to get $y_h$ (characteristic equation); you just need *any single* $y_p$ that matches the right side.\n\n**Example $y'' - 3y' + 2y = x$:** from the previous problem, $y_h = c_1 e^x + c_2 e^{2x}$. For $y_p$, guess a form matching the RHS — since $R(x)=x$ is a degree-1 polynomial, try $y_p = mx + n$. Then $y_p'' = 0$, $y_p' = m$, so $0 - 3m + 2(mx+n) = x$. Matching coefficients: $2m = 1 \\Rightarrow m = \\tfrac12$, and $-3m + 2n = 0 \\Rightarrow n = \\tfrac34$. So\n$$y = c_1 e^x + c_2 e^{2x} + \\tfrac12 x + \\tfrac34.$$\n\n('Guess the form of the RHS' is the method of undetermined coefficients: polynomial → polynomial, $e^{kx}$ → $Ae^{kx}$, $\\sin/\\cos$ → combination of both.)",
                keyIdea: "General = homogeneous + particular. Find $y_p$ by guessing a form matching the right-hand side (undetermined coefficients), then add the homogeneous solution."
              }
            ]
          },
          {
            id: "3.6",
            title: "Linear Algebra",
            note: "Vectors, matrices, eigen-decompositions and matrix factorizations power covariance analysis, PCA, regression, and Monte Carlo correlation — the daily tools of quant work.",
            problems: [
              {
                title: "Vectors",
                difficulty: "easy",
                tags: ["vectors", "dot product"],
                statement: "What does the dot product measure, and when are two vectors orthogonal? What is the geometric meaning of $a\\cdot b$?",
                hint: "$a\\cdot b = |a||b|\\cos\\theta$. Think about projection and the angle between vectors.",
                solution: "The **dot product** of $a, b \\in \\mathbb{R}^n$ is $a\\cdot b = \\sum_i a_i b_i$, and geometrically\n$$a\\cdot b = |a|\\,|b|\\cos\\theta,$$\nwhere $\\theta$ is the angle between them. So it measures **how much two vectors point the same way** — it's $|b|$ times the (signed) length of $a$'s projection onto $b$.\n\nConsequences worth knowing:\n- **Orthogonal** (perpendicular) ⇔ $a\\cdot b = 0$ (since $\\cos 90° = 0$).\n- $a\\cdot a = |a|^2$, so the dot product gives length.\n- $\\cos\\theta = \\frac{a\\cdot b}{|a||b|}$ is the **cosine similarity** — and for mean-zero data vectors it's exactly the **correlation coefficient**, which is why linear algebra and statistics are so intertwined in quant work.",
                keyIdea: "$a\\cdot b = |a||b|\\cos\\theta$ measures alignment/projection; zero means orthogonal. For centered data it *is* correlation — the bridge between geometry and statistics."
              },
              {
                title: "QR Decomposition",
                difficulty: "hard",
                tags: ["linear algebra", "orthogonalization", "regression"],
                statement: "What is the QR decomposition, how is it computed, and what is it used for?",
                hint: "Factor $A = QR$ with $Q$ orthonormal and $R$ upper-triangular — think Gram–Schmidt.",
                solution: "**What it is:** any matrix $A$ (with independent columns) factors as\n$$A = QR,$$\nwhere $Q$ has **orthonormal columns** ($Q^\\top Q = I$) and $R$ is **upper-triangular**.\n\n**How:** apply **Gram–Schmidt** to the columns of $A$ — take each column, subtract its projections onto the already-orthonormalized earlier columns, and normalize. Those orthonormal vectors form $Q$; the projection coefficients fill $R$. (In practice, numerically stable variants like Householder reflections are used.)\n\n**Why it matters:** QR is the workhorse for **least-squares regression**. To solve $A x \\approx b$, substituting $A = QR$ reduces the normal equations to $R x = Q^\\top b$ — an easy triangular back-substitution, and far more numerically stable than forming $A^\\top A$ directly. It's also the engine of the **QR algorithm** for computing eigenvalues.",
                keyIdea: "$A = QR$ (orthonormal $Q$ × triangular $R$) via Gram–Schmidt. It makes least-squares stable ($Rx = Q^\\top b$) and underlies eigenvalue algorithms."
              },
              {
                title: "Determinant, Eigenvalue & Eigenvector",
                difficulty: "hard",
                tags: ["linear algebra", "eigenvalues"],
                statement: "Define eigenvalues/eigenvectors and explain how to find them. What do the determinant and trace tell you about them?",
                hint: "$Av = \\lambda v$. Eigenvalues solve $\\det(A - \\lambda I) = 0$.",
                solution: "An **eigenvector** $v$ of $A$ is a nonzero vector that $A$ merely **scales**, not rotates: $Av = \\lambda v$, with **eigenvalue** $\\lambda$ the scaling factor.\n\n**Finding them:** rewrite as $(A - \\lambda I)v = 0$. For a nonzero $v$ to exist, $A - \\lambda I$ must be singular, so\n$$\\det(A - \\lambda I) = 0 \\quad(\\text{the characteristic equation}).$$\nSolve this polynomial for the $\\lambda$'s, then for each $\\lambda$ solve $(A-\\lambda I)v = 0$ for its eigenvector(s).\n\n**Two beautiful shortcuts** linking eigenvalues to easy-to-read quantities:\n- $\\det(A) = \\prod_i \\lambda_i$ — the determinant is the **product** of eigenvalues (so $A$ is invertible ⇔ no zero eigenvalue).\n- $\\text{trace}(A) = \\sum_i \\lambda_i$ — the trace (sum of diagonal) is the **sum** of eigenvalues.\n\nThese power PCA (eigenvectors of the covariance matrix are the principal directions; eigenvalues are the variances along them).",
                keyIdea: "Eigenvectors are directions $A$ only scales; eigenvalues solve $\\det(A-\\lambda I)=0$. Determinant = product of eigenvalues, trace = sum — the basis of PCA."
              },
              {
                title: "Positive Semidefinite/Definite Matrix",
                difficulty: "hard",
                tags: ["linear algebra", "covariance"],
                statement: "What does it mean for a symmetric matrix to be positive (semi)definite, and why does it matter for covariance matrices?",
                hint: "Positive definite ⇔ $x^\\top A x > 0$ for all nonzero $x$ ⇔ all eigenvalues positive.",
                solution: "A symmetric matrix $A$ is **positive definite** if $x^\\top A x > 0$ for every nonzero vector $x$ (and **positive semidefinite**, PSD, if $\\ge 0$). Equivalent characterizations worth knowing:\n- all **eigenvalues are positive** (PSD: $\\ge 0$);\n- all **leading principal minors** are positive (Sylvester's criterion);\n- it has a **Cholesky factorization** $A = LL^\\top$.\n\n**Why it matters for covariance.** Any valid covariance matrix $\\Sigma$ **must** be PSD, because for any portfolio weights $w$, the variance $w^\\top\\Sigma w = \\text{Var}(w^\\top X) \\ge 0$ — variance can't be negative. So PSD-ness is the consistency condition for a covariance matrix. This shows up constantly: an estimated correlation matrix that *isn't* PSD (e.g. from mismatched data windows) will break Cholesky-based Monte Carlo and mean-variance optimization, and must be 'repaired' back to PSD.",
                keyIdea: "Positive (semi)definite ⇔ $x^\\top A x > 0$ ($\\ge 0$) ⇔ eigenvalues positive (non-negative). Every covariance matrix must be PSD because variances $w^\\top\\Sigma w$ can't be negative."
              },
              {
                title: "LU and Cholesky Decomposition",
                difficulty: "hard",
                tags: ["linear algebra", "factorization", "Monte Carlo"],
                statement: "What are the LU and Cholesky decompositions, and what are they used for?",
                hint: "LU = lower × upper (Gaussian elimination). Cholesky is the symmetric-positive-definite special case, $A = LL^\\top$.",
                solution: "**LU decomposition:** factor a square matrix $A = LU$ into a **lower**-triangular $L$ and an **upper**-triangular $U$. It's just **Gaussian elimination** recorded as matrices ($U$ is the row-echelon result; $L$ stores the elimination multipliers). Once you have it, solving $Ax = b$ becomes two fast triangular solves ($Ly = b$, then $Ux = y$) — and you can reuse the factorization for many right-hand sides.\n\n**Cholesky decomposition:** the special, more efficient case when $A$ is **symmetric positive definite**:\n$$A = L L^\\top,$$\none triangular factor and its transpose. It's about twice as fast as LU and numerically very stable.\n\n**The quant application — correlated random draws.** To simulate a vector of correlated normals with covariance $\\Sigma$, take independent standard normals $z$ and form $x = Lz$ where $\\Sigma = LL^\\top$. Then $\\text{Cov}(x) = L\\,\\text{Cov}(z)\\,L^\\top = LL^\\top = \\Sigma$. This Cholesky step is *the* standard way to inject correlation into Monte Carlo simulations (and it only works if $\\Sigma$ is genuinely PSD — see the previous problem).",
                keyIdea: "LU = recorded Gaussian elimination (fast repeated solves); Cholesky $A=LL^\\top$ is the SPD special case. Cholesky turns independent normals into correlated ones ($x = Lz$) — the backbone of correlated Monte Carlo."
              }
            ]
          }
        ]
      },
      {
        num: 4,
        title: "Probability Theory",
        blurb: "Combinatorics, conditional probability and Bayes, distributions, expectation/variance, and order statistics — the heart of quant interviews.",
        topics: [
          {
            id: "4.1",
            title: "Basic Probability & Set Operations",
            note: "Lean on **symmetry** and on identifying the right **events**. Often the elegant solution counts mutually exclusive, symmetric events instead of grinding through formulas.",
            problems: [
              {
                title: "Coin Toss Game",
                difficulty: "medium",
                tags: ["symmetry", "probability"],
                statement: "Gambler A has $n+1$ fair coins; gambler B has $n$ fair coins. Both flip all their coins. What is the probability that A ends up with **strictly more** heads than B?",
                hint: "Remove one coin from A so both have $n$ coins and the situation is symmetric. What can happen with A's extra coin?",
                solution: "**The setup looks lopsided** (A has an extra coin), so summing binomial probabilities would be ugly. Instead, hide the extra coin and exploit symmetry.\n\n**Step 1 — make it symmetric.** Set A's extra coin aside, so A and B each flip $n$ coins. Comparing those, exactly one of three things happens:\n- $E_1$: A leads, $E_2$: they tie, $E_3$: B leads.\n\nSince A and B are now identical, $P(E_1) = P(E_3)$. Call that $y$ each, and let $P(E_2) = x$. They sum to 1: $\\;2y + x = 1$.\n\n**Step 2 — bring back the extra coin** and ask when A ends up *strictly ahead overall*:\n- If A was **already leading** ($E_1$, prob $y$): A wins no matter what the extra coin does.\n- If they were **tied** ($E_2$, prob $x$): the extra coin breaks the tie in A's favor exactly half the time → contributes $x/2$.\n- If A was **behind** ($E_3$): one extra head can at best tie, never overtake → contributes 0.\n\n**Step 3 — add up:**\n$$P(\\text{A wins}) = y + \\tfrac{x}{2} = y + \\tfrac{1}{2}(1 - 2y) = \\tfrac{1}{2}.$$\n\n**Exactly $\\tfrac12$ — and notice $n$ never appeared.** The extra coin is precisely what's needed to overcome A's disadvantage of having to *strictly* beat B.",
                keyIdea: "Strip away the asymmetry (the extra coin) to expose a symmetric core, then let the tie-breaking coin do the rest. The clean answer $1/2$ falls out without summing binomials."
              },
              {
                title: "Card Game",
                difficulty: "medium",
                tags: ["symmetry", "expected value", "counting"],
                statement: "A 52-card deck has 4 cards of each value 2,3,…,10,J,Q,K,A. You draw one card; the dealer then draws another (no replacement). Higher number wins (ties: house wins). What is your probability of winning?",
                hint: "Compare three symmetric events: your card higher, equal, or lower than the dealer's.",
                solution: "**The slow way first (so the trick makes sense).** You could condition on the value of *your* card. There are 13 equally likely values, each with probability $1/13$. After you draw, 51 cards remain.\n- If you drew a **2**, you beat nothing — $0/51$.\n- If you drew a **3**, you beat the four 2's — $4/51$.\n- ...\n- If you drew an **A**, you beat everything below it (the 2's through K's) — $48/51$.\n\nThe numbers you beat go $0, 4, 8, \\ldots, 48$, i.e. $4\\times(0+1+2+\\cdots+12)$. So\n$$P(\\text{win}) = \\frac{1}{13}\\cdot\\frac{4(0+1+\\cdots+12)}{51} = \\frac{1}{13}\\cdot\\frac{4\\cdot 78}{51} = \\frac{8}{17}.$$\nThis works, but it makes you sum a sequence. There's a cleaner path.\n\n**The fast way — use symmetry.** Compare your card to the dealer's. Exactly one of three things happens:\n- $E_1$: your card is **higher** (you win),\n- $E_2$: the two cards are **equal** (tie → house wins),\n- $E_3$: your card is **lower** (you lose).\n\nThese three cover everything, so $P(E_1)+P(E_2)+P(E_3)=1$.\n\nNow the key insight: **there's nothing special about being 'you' versus the 'dealer.'** Both of you just draw one card from the same deck, in symmetric positions. So you're exactly as likely to come out higher as lower:\n$$P(E_1) = P(E_3).$$\n\nThat means the win and lose probabilities split the *non-tie* outcomes evenly:\n$$P(E_1) = \\frac{1 - P(E_2)}{2}.$$\n\nSo all we need is the **tie probability** $P(E_2)$ — and that's easy. Whatever card you hold, 51 cards remain and exactly **3** of them share your value. So\n$$P(E_2) = \\frac{3}{51} = \\frac{1}{17}.$$\n\nPlug in:\n$$P(\\text{win}) = \\frac{1 - 1/17}{2} = \\frac{16/17}{2} = \\boxed{\\frac{8}{17}}.$$\n\nBoth methods agree, but the symmetry argument turned a sum-of-a-sequence problem into a one-line tie calculation.",
                keyIdea: "Symmetry between 'you higher' and 'dealer higher' reduces the problem to computing the tie probability $3/51$."
              },
              {
                title: "Drunk Passenger",
                difficulty: "hard",
                tags: ["symmetry", "recursion"],
                statement: "100 passengers board a plane with 100 assigned seats. The first (drunk) passenger sits in a uniformly random seat. Each later passenger takes their own seat if free, otherwise a random free seat. What is the probability that the **last** passenger gets their own seat (#100)?",
                hint: "Focus only on seats #1 and #100. By symmetry, which gets taken first?",
                solution: "**The clever reframing:** ignore all 98 people in the middle and watch only **two special seats** — seat #1 (the drunk's own seat) and seat #100 (the last passenger's seat). The whole drama is decided by which of these two gets taken first.\n\nWhy those two? Trace what happens to the last passenger:\n- If **seat #100** gets occupied at some point before they board, they're out of luck — displaced.\n- If **seat #1** gets occupied first, then everyone else could sit in their own seat, and #100 is guaranteed free for the last passenger.\n\nSo the last passenger gets their seat **iff seat #1 is taken before seat #100**.\n\nNow the symmetry: every time *anyone* sits randomly (the drunk, or a later displaced passenger), seats #1 and #100 are just two of the available options with **equal** chance of being picked. Neither is ever favored over the other. So whichever gets grabbed first is a coin flip:\n$$P(\\text{last passenger gets seat \\#100}) = \\tfrac{1}{2}.$$\n\nStriking detail: this is $\\tfrac12$ whether there are 100 passengers or 2 — the count never matters.",
                keyIdea: "Collapse a 100-step process to a race between two equally-likely seats. Symmetry gives $1/2$ with no recursion needed."
              },
              {
                title: "N Points on a Circle",
                difficulty: "hard",
                tags: ["geometry", "mutually exclusive events"],
                statement: "$N$ points are drawn uniformly at random on the circumference of a circle. What is the probability that all $N$ points lie within some **semicircle**?",
                hint: "Consider the event that, starting from point $n$ and going clockwise, all other points fall in the clockwise semicircle. Are these events (over the starting point) mutually exclusive?",
                solution: "**The reframing:** \"all points fit in *some* semicircle\" is vague — there are infinitely many semicircles. Pin it down: if they all fit in one, there's a unique **leading** point — the one such that all the others lie in the half-circle *clockwise* from it.\n\nLabel the points $1,\\dots,N$ and define $E_i$ = \"point $i$ is that leading point\", i.e. the other $N-1$ points all fall in the semicircle starting at $i$ and going clockwise.\n\n**Probability of one $E_i$:** fix point $i$; each of the other $N-1$ points independently has a $\\tfrac12$ chance of landing in that specific semicircle, so\n$$P(E_i) = \\left(\\tfrac12\\right)^{N-1}.$$\n\n**Why we can just add them:** the $E_i$ are **mutually exclusive** — there can be only *one* leading point, so no two $E_i$ happen together. That means no messy overlap corrections:\n$$P(\\text{all in a semicircle}) = \\sum_{i=1}^{N} P(E_i) = N \\cdot \\frac{1}{2^{N-1}} = \\frac{N}{2^{N-1}}.$$\n\n*(Same logic for an arc that's a fraction $x \\le \\tfrac12$ of the circle gives $N x^{N-1}$.)*",
                keyIdea: "Define one event per 'leading' point; mutual exclusivity lets you simply add probabilities instead of using inclusion–exclusion."
              }
            ]
          },
          {
            id: "4.2",
            title: "Combinatorial Analysis",
            note: "Counting tools: **permutations** $\\frac{n!}{n_1!\\cdots n_r!}$, **combinations** $\\binom{n}{r}$, the **binomial theorem**, and **inclusion–exclusion** for unions of overlapping events.",
            problems: [
              {
                title: "Poker Hands",
                difficulty: "medium",
                tags: ["combinations", "counting"],
                statement: "From a 52-card deck (13 values × 4 suits), a hand is 5 cards. Count the hands that are **four-of-a-kind**, a **full house**, and **two pairs**.",
                hint: "Total hands = $\\binom{52}{5}$. Build each hand by choosing values first, then suits.",
                solution: "Total possible hands: $\\binom{52}{5} = 2{,}598{,}960$.\n\n**Four-of-a-kind:** choose the quad's value (13 ways), the 5th card is any of the other 48 → $13 \\times 48 = 624$.\n\n**Full house:** value of the triple (13), suits of the triple $\\binom{4}{3}$, value of the pair (12), suits of the pair $\\binom{4}{2}$:\n$$13 \\times \\binom{4}{3} \\times 12 \\times \\binom{4}{2} = 13 \\times 4 \\times 12 \\times 6 = 3{,}744.$$\n\n**Two pairs:** choose 2 values for the pairs $\\binom{13}{2}$, suits of each pair $\\binom{4}{2}\\binom{4}{2}$, and the 5th card from the remaining $44$ cards:\n$$\\binom{13}{2}\\binom{4}{2}\\binom{4}{2} \\times 44 = 78 \\times 6 \\times 6 \\times 44 = 123{,}552.$$\n\nDivide each by $\\binom{52}{5}$ for probabilities.",
                keyIdea: "Always count in the order 'choose values → choose suits → choose remaining cards', being careful not to double-count the leftover card's value."
              },
              {
                title: "Hopping Rabbit",
                difficulty: "easy",
                tags: ["recursion", "Fibonacci", "induction"],
                statement: "A rabbit climbs a staircase of $n$ stairs, hopping 1 or 2 stairs at a time. How many distinct ways are there to reach the top?",
                hint: "Before the final hop, the rabbit is on stair $n-1$ or $n-2$.",
                solution: "Let $f(n)$ be the number of ways. Base cases $f(1)=1$, $f(2)=2$. For $n>2$, the last hop is either a 1-stair hop (from stair $n-1$) or a 2-stair hop (from stair $n-2$):\n$$f(n) = f(n-1) + f(n-2).$$\nThis is the **Fibonacci** recurrence (with $f(1)=1, f(2)=2$), so $f(n)$ is the $(n+1)$-th Fibonacci number.",
                keyIdea: "Condition on the final move to get a recurrence — here the classic Fibonacci relation."
              },
              {
                title: "Screwy Pirates 2",
                difficulty: "hard",
                tags: ["combinations", "cryptography", "inclusion"],
                statement: "11 pirates protect treasure in a safe. Any majority (≥6) must be able to open it, but any group of ≤5 must not. Each lock can have several keys; each key opens only its lock. What is the minimum number of locks, and how many keys does each pirate carry?",
                hint: "Every subgroup of 6 should share a key to some lock that the other 5 pirates don't have.",
                solution: "**Translate the requirement into locks.** \"Any 5 pirates must be *stuck*\" means: for every group of 5, there's at least one lock **none of them can open**. \"Any 6 can open everything\" means that whenever you add a 6th pirate, that missing key appears.\n\n**Step 1 — one lock per 5-pirate group.** For each possible group of 5 pirates, create a dedicated lock and give its key to the **other 6** pirates (everyone outside that group). Then those 5 are blocked by exactly that lock, but any 6th pirate is outside the group, so they hold the key — the blockade vanishes the moment the group grows to 6.\n\n**Step 2 — count the locks.** One lock per 5-pirate subset of 11:\n$$\\binom{11}{5} = 462 \\text{ locks}.$$\n\n**Step 3 — keys per pirate.** Each lock's key goes to 6 pirates, so there are $462 \\times 6$ key-copies total, shared equally among 11 pirates:\n$$\\frac{462 \\times 6}{11} = 252 \\text{ keys each}.$$\n\n(This is the spirit of Shamir's *How to Share a Secret* — threshold access built from combinatorics.)",
                keyIdea: "Map each minimal 'forbidden' coalition to a lock; the complement holds its key. Threshold access = a combinatorial design problem."
              },
              {
                title: "Chess Tournament",
                difficulty: "medium",
                tags: ["counting", "probability", "recursion"],
                statement: "$2^n$ players with strictly ordered skills (player 1 best) play a single-elimination knockout; the better player always wins. Pairings each round are random. What is the probability that players 1 and 2 meet in the **final**?",
                hint: "For them to meet in the final they must be drawn into different halves of the bracket.",
                solution: "**The key simplification:** in a knockout bracket, two players can only meet in the *final* if they come from **opposite halves** of the bracket. (The whole field of $2^n$ splits into two halves of $2^{n-1}$; each half produces one finalist.) And since the best player always wins, both player 1 and player 2 will definitely win their own half — so the only question is whether they started in different halves.\n\nSo place player 1 anywhere. Now player 2 lands in one of the remaining $2^n - 1$ slots, of which $2^{n-1}$ sit in the *other* half. Therefore\n$$P(\\text{meet in final}) = \\frac{2^{n-1}}{2^n - 1}.$$\n\nThat's it — no need to track each round. (If you did multiply the round-by-round 'don't meet yet' probabilities, the product telescopes to the same answer.)",
                keyIdea: "The whole tournament reduces to one question: do the two top players start in different halves? Counting slots beats multiplying round-by-round probabilities."
              },
              {
                title: "Application Letters",
                difficulty: "medium",
                tags: ["inclusion-exclusion", "derangement"],
                statement: "You have 5 personalized cover letters and 5 addressed envelopes. Your toddler stuffs each letter into a random envelope (a random permutation). What is the probability that **all 5** letters go to the wrong envelope?",
                hint: "Use inclusion–exclusion on the events $E_i$ = 'letter $i$ is in the correct envelope.'",
                solution: "**Flip the question.** 'All 5 wrong' is awkward to count directly, so compute its opposite — 'at least one letter is right' — and subtract from 1.\n\nLet $E_i$ = 'letter $i$ lands in its correct envelope.' We want $1 - P(E_1 \\cup \\cdots \\cup E_5)$, and the union is handled by **inclusion–exclusion** (add singles, subtract pairs, add triples, …).\n\nA neat fact makes the terms easy: forcing $k$ specific letters to be correct leaves the other $4{-}k$... more precisely it pins $k$ positions and lets the rest permute freely, and after multiplying by the number of ways to choose those $k$ letters, each whole term collapses to $\\tfrac{1}{k!}$. So\n$$P\\Big(\\bigcup_{i=1}^5 E_i\\Big) = \\frac{1}{1!} - \\frac{1}{2!} + \\frac{1}{3!} - \\frac{1}{4!} + \\frac{1}{5!} = \\frac{19}{30}.$$\n\nTherefore the probability **all five are wrong** (a *derangement*) is\n$$1 - \\frac{19}{30} = \\frac{11}{30} \\approx 0.367.$$\n\nBeautiful punchline: that alternating sum is the start of the series for $e^{-1}$, so as $n\\to\\infty$ the answer tends to $\\tfrac1e \\approx 0.368$ — the chance of a total mix-up barely changes no matter how many letters there are.",
                keyIdea: "Derangement count via inclusion–exclusion: $\\sum_{k=0}^n \\frac{(-1)^k}{k!}$, which converges to $1/e$."
              },
              {
                title: "Birthday Problem",
                difficulty: "medium",
                tags: ["counting", "complement"],
                statement: "How many people are needed in a room so that the probability that **two share a birthday** exceeds $1/2$? (Assume 365 equally likely days.)",
                hint: "Compute the complement: the probability everyone's birthday is distinct.",
                solution: "For $n$ people, the probability **all** birthdays differ is\n$$\\frac{365 \\times 364 \\times \\cdots \\times (365 - n + 1)}{365^n}.$$\nWe want this below $1/2$. Evaluating, $n = 22$ gives ≈ 0.524 (still >½) and $n = 23$ gives ≈ 0.493 (<½). So **23 people** make a shared birthday more likely than not.",
                keyIdea: "Counting the complementary 'all distinct' event is far easier than the direct event. The surprisingly small answer (23) is the famous birthday paradox."
              },
              {
                title: "100th Digit",
                difficulty: "hard",
                tags: ["binomial theorem", "conjugate"],
                statement: "What is the 100th digit to the right of the decimal point in the decimal expansion of $(1 + \\sqrt2)^{3000}$?",
                hint: "$(1+\\sqrt2)^n + (1-\\sqrt2)^n$ is an integer. What happens to $(1-\\sqrt2)^n$ as $n$ grows?",
                solution: "**The trick:** you can't compute $(1+\\sqrt2)^{3000}$ directly, but you don't need to — pair it with its **conjugate** $(1-\\sqrt2)^{3000}$, because together they behave nicely.\n\n**Step 1 — the conjugate kills the irrational part.** Expand both with the binomial theorem. In $(1+\\sqrt2)^n$ the odd powers of $\\sqrt2$ are irrational; in $(1-\\sqrt2)^n$ those same terms appear with **opposite sign**. Add the two and every $\\sqrt2$ term cancels, leaving a whole number:\n$$\\underbrace{(1+\\sqrt2)^{3000} + (1-\\sqrt2)^{3000}}_{\\text{some integer } K}.$$\n\n**Step 2 — the conjugate term is microscopic.** Note $|1-\\sqrt2| = \\sqrt2 - 1 \\approx 0.414 < 1$. Raising a number below 1 to the 3000th power makes it *unimaginably* tiny:\n$$0 < (\\sqrt2-1)^{3000} \\ll 10^{-100}.$$\n\n**Step 3 — read off the digit.** Rearranging Step 1, $(1+\\sqrt2)^{3000} = K - (\\sqrt2-1)^{3000}$ — an integer minus a sliver smaller than $10^{-100}$. A number *just barely* below a whole number looks like $K{-}1.999\\ldots9\\ldots$, with a long run of 9s. Since the sliver is below $10^{-100}$, the 9s extend well past the 100th place.\n\nSo the **100th digit after the decimal point is 9**.",
                keyIdea: "Add the conjugate to manufacture an integer; the conjugate's tiny magnitude forces a long run of 9s just below an integer."
              },
              {
                title: "Cubic of Integer",
                difficulty: "medium",
                tags: ["binomial theorem", "modular"],
                statement: "If an integer $x$ is chosen uniformly between 1 and $10^{12}$, what is the probability that $x^3$ ends in **11** (its last two digits are 11)?",
                hint: "The last two digits of $x^3$ depend only on the last two digits of $x$.",
                solution: "**Key observation:** the last two digits of $x^3$ depend only on the last two digits of $x$. So write $x = a + 10b$, where $a$ is the units digit and $b$ carries the tens digit. Cube it:\n$$x^3 = a^3 + 30a^2 b + 300ab^2 + 1000b^3.$$\nOnly the first two terms can affect the last *two* digits (the rest are multiples of 100).\n\n**Step 1 — match the units digit (must be 1).** The units digit of $x^3$ is just the units digit of $a^3$. Checking $a = 0,1,\\dots,9$, the only one whose cube ends in 1 is $a = 1$ ($1^3 = 1$). So $a = 1$ — a $\\tfrac{1}{10}$ chance.\n\n**Step 2 — match the tens digit (must be 1).** With $a=1$, the tens digit comes from $30a^2 b = 30b$, whose tens digit is $3b \\bmod 10$. We need $3b \\equiv 1 \\pmod{10}$, which gives $b \\equiv 7$ (since $3\\times7=21$). So the tens digit of $x$ must be 7 — another $\\tfrac{1}{10}$ chance.\n\n**Step 3 — combine.** The two digit-conditions are independent, so\n$$P = \\tfrac{1}{10} \\times \\tfrac{1}{10} = \\tfrac{1}{100} = \\mathbf{1\\%}.$$\n(For example, $x$ ending in $71$: $71^3 = 357{,}911$ — ends in 11. ✓)",
                keyIdea: "Use the binomial expansion to isolate which digits of $x$ control the last two digits of $x^3$, then count residues mod 10."
              }
            ]
          },
          {
            id: "4.3",
            title: "Conditional Probability & Bayes' Formula",
            note: "$P(A|B) = \\frac{P(AB)}{P(B)}$. Tools: the **multiplication rule**, the **law of total probability** $P(A) = \\sum_i P(A|F_i)P(F_i)$, and **Bayes' formula** to flip conditionals.",
            problems: [
              {
                title: "Boys and Girls",
                difficulty: "medium",
                tags: ["conditional probability", "sample space"],
                statement: "Part A: Mrs. Jackson has two children, at least one a boy. Probability both are boys? Part B: Your colleague Mr. Parker has two children; one is a boy walking with him. Probability both are boys?",
                hint: "Write out the equally likely sample space {bb, bg, gb, gg} and condition carefully — the two parts condition on different information.",
                solution: "Both parts share the same sample space — two kids, by (older, younger): $\\{bb, bg, gb, gg\\}$, each with probability $\\tfrac14$. The twist is **what each part lets you condition on**, and that changes the answer.\n\n**Part A — \"at least one is a boy.\"** This only rules out $gg$, leaving $\\{bb, bg, gb\\}$, all equally likely. Of those, just one is $bb$:\n$$P(bb \\mid \\text{at least one boy}) = \\frac{1/4}{3/4} = \\frac{1}{3}.$$\n\n**Part B — \"*this specific* child (the one walking with him) is a boy.\"** Now you've identified a *particular* child as a boy; the **other** child's gender is an independent coin flip, untouched by that information:\n$$P(\\text{both boys}) = \\frac{1}{2}.$$\n\n**Why they differ:** \"at least one of the two is a boy\" is a statement about the *pair* (it bundles $bg$ and $gb$ together), whereas \"this one is a boy\" isolates a *single* child and leaves the sibling free. Same words 'a boy,' very different conditioning.",
                keyIdea: "The information you condition on determines the answer. 'At least one is a boy' (1/3) ≠ 'this specific one is a boy' (1/2)."
              },
              {
                title: "All-Girl World?",
                difficulty: "medium",
                tags: ["expectation", "intuition"],
                statement: "In a society every couple keeps having children until they get a girl, then stops. Genders are independent with $P(\\text{girl}) = 1/2$. Will this society end up with more girls than boys?",
                hint: "Gender at birth doesn't depend on the stopping rule. What fraction of all births are girls?",
                solution: "**No — the ratio stays exactly 50/50.** It's tempting to think 'everyone stops at a girl, so girls must be more common,' but that intuition is wrong.\n\nThe reason: a stopping rule decides *when a family stops having kids*, but it can't touch the coin flip that decides each individual birth. Every single birth, in every family, is independently a girl or boy with probability $\\tfrac12$ — the rule never gets to peek at or bias that flip. So pooling *all* births across society, exactly half are girls.\n\nWhat the preference *does* change is the **distribution of family sizes** (lots of one-child 'girl' families, fewer long 'boy-boy-…-girl' families), but it leaves the overall **sex ratio untouched** at 50/50.",
                keyIdea: "A stopping rule based on outcomes cannot bias the underlying independent process. Expected boys = expected girls."
              },
              {
                title: "Unfair Coin",
                difficulty: "medium",
                tags: ["Bayes"],
                statement: "Among 1000 coins, 1 is double-headed; the other 999 are fair. You pick a coin at random and toss it 10 times — all 10 come up heads. What's the probability you picked the unfair coin?",
                hint: "Bayes: combine the prior 1/1000 with the likelihood of 10 heads under each hypothesis.",
                solution: "**Bayes updates a prior with evidence.** Let $A$ = 'picked the double-headed coin' and $B$ = 'saw 10 heads in a row'.\n\n- **Priors:** $P(A) = \\tfrac{1}{1000}$, $P(A^c) = \\tfrac{999}{1000}$.\n- **Likelihoods:** the trick coin *always* shows heads, $P(B \\mid A) = 1$; a fair coin shows 10 heads with $P(B \\mid A^c) = (\\tfrac12)^{10} = \\tfrac{1}{1024}$.\n\nApply Bayes (the denominator is the total probability of seeing 10 heads):\n$$P(A \\mid B) = \\frac{P(B\\mid A)P(A)}{P(B\\mid A)P(A) + P(B\\mid A^c)P(A^c)} = \\frac{1\\cdot\\tfrac{1}{1000}}{1\\cdot\\tfrac{1}{1000} + \\tfrac{1}{1024}\\cdot\\tfrac{999}{1000}} \\approx 0.506.$$\n\n**Why it lands near 50/50:** ten straight heads is about a 1-in-1024 fluke for a fair coin — almost exactly as rare as the 1-in-1000 chance of grabbing the trick coin. The two rarities nearly cancel, so the evidence pulls a tiny prior all the way up to roughly even odds.",
                keyIdea: "Strong evidence (10 heads) updates a tiny prior (1/1000) to roughly even odds — because 10 heads is itself ~1/1000 likely for a fair coin."
              },
              {
                title: "Fair Probability from an Unfair Coin",
                difficulty: "medium",
                tags: ["symmetry", "algorithm"],
                statement: "You have a biased coin with unknown $P(\\text{head}) = p_H$. How do you simulate a fair 50/50 outcome?",
                hint: "Use two tosses and exploit a symmetry between two of the outcomes.",
                solution: "**The idea:** even a biased coin treats the two *mixed* sequences symmetrically. Toss the coin **twice** and look at the ordered result:\n- $HH$: prob $p_H^2$\n- $TT$: prob $p_T^2$\n- $HT$: prob $p_H p_T$\n- $TH$: prob $p_T p_H$\n\nThe punchline: $P(HT) = P(TH) = p_H p_T$ **exactly**, no matter the bias, because multiplication commutes.\n\nSo the rule is: call **$HT$ = 'heads', $TH$ = 'tails'**, and if you get $HH$ or $TT$, **throw both away and repeat**. The two outcomes you keep are equally likely, giving a perfectly fair 50/50 — this is *von Neumann's* trick.",
                keyIdea: "Von Neumann's trick: the two mixed outcomes $HT$ and $TH$ are always equiprobable regardless of bias; discard the symmetric ties."
              },
              {
                title: "Dart Game",
                difficulty: "medium",
                tags: ["symmetry", "order", "independence"],
                statement: "Jason throws darts aiming at the center; skill is constant. The 2nd dart lands farther from center than the 1st. What is the probability the 3rd dart is farther from center than the **1st**? (General: $n$ darts.)",
                hint: "Rank the throws by distance. Is 'the last throw is the best' independent of the order of the earlier throws?",
                solution: "Because skill is constant, the dart distances are i.i.d. — so **all orderings of them are equally likely**, and we can answer with pure symmetry, no integrals.\n\nThe condition '2nd farther than 1st' is just telling us the 1st throw is the best (closest) so far. The general question becomes: given the 1st of $n$ throws is the best of those $n$, what's the chance the next throw is **also** farther than the 1st (i.e. doesn't become the new closest)?\n\nKey symmetry fact: among $n+1$ i.i.d. throws, each is equally likely to be the closest, so the $(n{+}1)$-th being the closest has probability $\\tfrac{1}{n+1}$ — and this is **independent** of how the first $n$ were ordered. Therefore the next throw is *not* the new best (so it's farther than the 1st) with probability\n$$1 - \\frac{1}{n+1} = \\frac{n}{n+1}.$$\n\nFor the 3-dart question, $n = 2$, giving $\\dfrac{2}{3}$.",
                keyIdea: "Among i.i.d. values, 'the newest one is the maximum' has probability $1/(n+1)$ and is independent of the earlier ordering — a recurring symmetry trick."
              },
              {
                title: "Birthday Line",
                difficulty: "hard",
                tags: ["optimization", "conditional probability"],
                statement: "A theater gives a free ticket to the first person in line whose birthday matches someone earlier in line. Which position maximizes your chance of winning? (365 equally likely days.)",
                hint: "To win at position $n$: the first $n-1$ people must all have distinct birthdays, AND yours must match one of them.",
                solution: "**The tension:** standing later in line gives more earlier people for *your* birthday to match — good. But it also makes it more likely two of *those* earlier people already matched each other (ending the game before you) — bad. The winning spot balances these two forces.\n\nTo win at position $n$ you need two things: the first $n-1$ people all have **distinct** birthdays (so the prize hasn't been given out yet), **and** your birthday matches one of those $n-1$:\n$$P(n) = \\underbrace{\\frac{365\\cdot 364\\cdots(365-n+2)}{365^{n-1}}}_{\\text{first }n-1\\text{ all distinct}} \\times \\underbrace{\\frac{n-1}{365}}_{\\text{you match one}}.$$\n\n**Find the peak.** The best $n$ is where $P(n)$ stops increasing — where $P(n) \\ge P(n-1)$ and $P(n) \\ge P(n+1)$. Forming those ratios, the 365-factorial parts cancel and you're left with simple quadratic inequalities $n^2 - n - 365 < 0$ and $n^2 - 3n - 363 > 0$. Both hold at $n = 20$.\n\n**Stand 20th in line.**",
                keyIdea: "Trade-off: deeper in line raises your match chance but lowers the chance the earlier birthdays are still all distinct. The product peaks at position 20."
              },
              {
                title: "Dice Order",
                difficulty: "easy",
                tags: ["conditional probability", "permutations"],
                statement: "Roll three dice one by one. What is the probability the three values are in **strictly increasing** order?",
                hint: "Condition on the three numbers being different.",
                solution: "**Split it into two independent pieces:** (1) the three values must be *distinct*, and (2) given they're distinct, they must come out in increasing order.\n\n**Distinct:** the 2nd roll must avoid the 1st ($\\tfrac56$) and the 3rd must avoid both ($\\tfrac46$):\n$$P(\\text{all different}) = 1 \\cdot \\tfrac{5}{6}\\cdot\\tfrac{4}{6} = \\tfrac{20}{36}.$$\n\n**Increasing given distinct:** any three distinct numbers have $3! = 6$ equally likely orderings, and exactly **one** is strictly increasing → probability $\\tfrac16$.\n\nMultiply:\n$$P = \\frac{20}{36}\\times\\frac{1}{6} = \\frac{20}{216} = \\frac{5}{54}.$$",
                keyIdea: "Split into 'distinct values' × 'correct ordering given distinct' — the ordering factor is simply $1/3!$."
              },
              {
                title: "Monty Hall Problem",
                difficulty: "medium",
                tags: ["conditional probability", "Bayes"],
                statement: "Three doors: one hides a car, two hide goats. You pick a door; the host (who knows) opens a different door revealing a goat, then offers you the switch. Should you switch?",
                hint: "The host's action is not independent of where the car is. What's the chance your original pick was wrong?",
                solution: "**Yes — switch. You win $\\tfrac{2}{3}$ of the time.**\n\nThe cleanest way to see it: think about what your switching strategy does in each starting case, *before* the host opens anything.\n\n- Your first pick is a **goat** with probability $\\tfrac{2}{3}$. In that case the host is *forced* to reveal the other goat, so the only door left to switch to is the **car**. Switching **wins**.\n- Your first pick is the **car** with probability $\\tfrac{1}{3}$. Then switching moves you to a goat. Switching **loses**.\n\nSo a switcher wins exactly when they *started* on a goat — probability $\\tfrac{2}{3}$ — versus $\\tfrac{1}{3}$ for someone who always stays.\n\n**Why intuition rebels:** it feels like 'two doors left, so 50/50.' But the host isn't a random door-opener — he *knows* where the car is and never opens it. That extra information is what tilts the leftover door to $\\tfrac{2}{3}$.",
                keyIdea: "The host's informed action transfers probability. Your initial guess is wrong 2/3 of the time, and switching converts every one of those into a win."
              },
              {
                title: "Amoeba Population",
                difficulty: "hard",
                tags: ["law of total probability", "branching process"],
                statement: "One amoeba each minute, with equal probability $1/4$, dies / stays the same / splits into two / splits into three (offspring behave independently). What is the probability the population eventually dies out?",
                hint: "Condition on the first minute and set up an equation: $P = \\sum P(\\text{extinct}\\,|\\,F_i)P(F_i)$.",
                solution: "**The self-referential trick:** let $P$ be the probability the whole line eventually dies out, starting from one amoeba. The key fact is that **each amoeba's descendants die out independently**, so if there are ever $k$ amoebas, the chance *all* their lineages vanish is $P^k$.\n\nNow condition on what the original amoeba does in the first minute (four equally likely outcomes):\n- **dies** ($\\tfrac14$): population gone → contributes $\\tfrac14 \\cdot 1$.\n- **stays as 1** ($\\tfrac14$): back to one amoeba → contributes $\\tfrac14 \\cdot P$.\n- **splits into 2** ($\\tfrac14$): both lines must die → contributes $\\tfrac14 \\cdot P^2$.\n- **splits into 3** ($\\tfrac14$): all three must die → contributes $\\tfrac14 \\cdot P^3$.\n\nAdd them (law of total probability):\n$$P = \\tfrac14\\big(1 + P + P^2 + P^3\\big) \\;\\Longrightarrow\\; P^3 + P^2 - 3P + 1 = 0.$$\n\n$P=1$ is a root (factor it out), and the remaining quadratic gives the root that lies in $(0,1)$:\n$$P = \\sqrt2 - 1 \\approx 0.414.$$\n\nSo there's about a **41% chance of extinction** — meaning the colony survives forever with probability ~59%.",
                keyIdea: "Branching-process extinction: independence makes a $k$-way split contribute $P^k$, yielding a fixed-point polynomial whose relevant root lies in $(0,1)$."
              },
              {
                title: "Candies in a Jar",
                difficulty: "hard",
                tags: ["conditional probability", "symmetry"],
                statement: "A jar has 10 red, 20 blue, 30 green candies. Drawing one at a time without replacement, what's the probability that at least 1 blue and 1 green remain when the **last red** is drawn?",
                hint: "Reframe via the *last* candy of each color. You want the red color to be exhausted before blue and before green.",
                solution: "**Reframe around the *last* candy of each color.** 'At least one blue and one green remain when the last red is drawn' simply means the reds are used up **before** the blues and **before** the greens. In terms of the positions $T_r, T_b, T_g$ of each color's *final* candy, we want $T_r < T_b$ **and** $T_r < T_g$ — i.e. red finishes first.\n\nRed finishing first means the overall last candy is blue or green, and so on. Split into the two orders where red is first:\n$$P = P(T_r < T_b < T_g) + P(T_r < T_g < T_b).$$\n\n**Use a slick symmetry:** the very last candy among all 60 is equally likely to be any individual candy, so it's green with prob $\\tfrac{30}{60}$, blue with $\\tfrac{20}{60}$, etc. Then, *given* the last one's color, the last among the remaining two colors is again proportional to their counts.\n\n- **Green last, then blue:** $\\tfrac{30}{60}\\cdot\\tfrac{20}{20+10} = \\tfrac{30}{60}\\cdot\\tfrac{20}{30}$.\n- **Blue last, then green:** $\\tfrac{20}{60}\\cdot\\tfrac{30}{30+10} = \\tfrac{20}{60}\\cdot\\tfrac{30}{40}$.\n\n$$P = \\frac{30}{60}\\cdot\\frac{20}{30} + \\frac{20}{60}\\cdot\\frac{30}{40} = \\frac{1}{3} + \\frac{1}{4} = \\frac{7}{12}.$$",
                keyIdea: "Translate 'reds run out first' into orderings of the *last* candy of each color; each color is equally likely to be last among any subset."
              },
              {
                title: "Coin Toss Game (A & B)",
                difficulty: "hard",
                tags: ["conditional probability", "symmetry"],
                statement: "A and B alternately toss a fair coin (A first). The game stops at the first occurrence of a **head immediately followed by a tail** (HT); whoever tossed that tail wins. What is the probability A wins?",
                hint: "Condition on A's first toss and use symmetry between the players' positions.",
                solution: "Two situations recur, so name both. Let $P$ = probability the **next tosser** wins from a *fresh* position (no pending $H$). Let $Q$ = probability the **next tosser** wins when there's already a **pending $H$** on the table.\n\n**Solve $Q$ first.** It's your turn with an $H$ already down:\n- you toss $T$ (prob $\\tfrac12$): you complete $HT$ → **you win**.\n- you toss $H$ (prob $\\tfrac12$): the $H$ is still pending, but now it's your *opponent's* turn in this same situation → you win with prob $1-Q$.\n$$Q = \\tfrac12 + \\tfrac12(1-Q) \\;\\Rightarrow\\; Q = \\tfrac{2}{3}.$$\n\n**Now the fresh game**, conditioning on the first toss:\n- toss $T$ (prob $\\tfrac12$): no $H$ yet, so the opponent now faces a fresh game as the next tosser → you win with prob $1-P$.\n- toss $H$ (prob $\\tfrac12$): an $H$ is pending and it's the opponent's turn → they're in the $Q$ situation, so you win with prob $1-Q = \\tfrac13$.\n$$P = \\tfrac12(1-P) + \\tfrac12\\cdot\\tfrac13 \\;\\Rightarrow\\; \\tfrac32 P = \\tfrac23 \\;\\Rightarrow\\; P = \\frac{4}{9}.$$\n\nSince A is the first tosser, **A wins with probability $\\tfrac{4}{9}$**. Sensibly below $\\tfrac12$: A can never win on toss 1 (no preceding $H$), so going first is a slight disadvantage here.",
                keyIdea: "Set up a self-referential equation by conditioning on the first toss; symmetry lets you express sub-cases as $1 - P(A)$."
              },
              {
                title: "Russian Roulette Series",
                difficulty: "medium",
                tags: ["conditional probability"],
                statement: "A 6-chamber revolver, one bullet, barrel spun once so each chamber is equally likely. Two players take turns pulling the trigger (no re-spin). Would you go first or second? Variant: re-spin before every pull. Variant: two bullets in consecutive chambers, opponent survives the first pull — should you spin before your turn?",
                hint: "Once spun, the bullet's position is fixed — count which trigger pulls hit it.",
                solution: "The whole answer hinges on one distinction: **is the bullet's position fixed, or re-randomized each pull?**\n\n**Variant 1 — spin once, no re-spin.** The bullet is locked into one of chambers 1–6, all equally likely. Player 1 pulls chambers 1, 3, 5; player 2 pulls 2, 4, 6 — each owns exactly 3 of the 6 chambers, so each loses with probability $\\tfrac36 = \\tfrac12$. **Order doesn't matter.**\n\n**Variant 2 — re-spin before every pull.** Now each pull is an independent $\\tfrac16$ risk. Player 1 loses with prob $\\tfrac16$ on pull 1; player 2 only ever pulls if player 1 survived, etc. Summing player 2's loss over the rounds gives total loss probability $\\tfrac{5}{11} < \\tfrac{6}{11}$. **So go second.** (Re-spinning lets the first player 'use up' the risk first.)\n\n**Variant 3 — two bullets in *consecutive* chambers, opponent already survived pull 1.** The fired chamber was empty, so it was one of the 4 empties. Lay them out: of those 4 empty chambers, exactly **1** is immediately followed by a bullet (the empty right before the bullet-pair) and **3** are followed by another empty. So **without spinning**, your survival is $\\tfrac34$. If you **spin**, you reset to 4 empty chambers out of 6, survival $\\tfrac46 = \\tfrac23 < \\tfrac34$. **Don't spin.**",
                keyIdea: "Distinguish independent (re-spin) from dependent (fixed bullet) trials. Conditioning on the survived chamber reshapes the odds."
              },
              {
                title: "Aces",
                difficulty: "medium",
                tags: ["conditional probability", "counting"],
                statement: "52 cards are dealt to 4 players, 13 each. What is the probability that **every** player gets exactly one ace?",
                hint: "Place the aces one at a time and track the conditional probability each lands in a fresh pile.",
                solution: "**Place the four aces one at a time** and ask, at each step, for the chance the new ace lands in a pile that doesn't already hold one.\n\n- The **1st** ace goes anywhere — fine.\n- For the **2nd** ace, 51 card-slots remain; the $13$ in the 1st ace's pile are 'bad', so it lands in a fresh pile with prob $\\tfrac{52-13}{51} = \\tfrac{39}{51}$.\n- The **3rd** ace must avoid the two used piles ($26$ bad slots of $50$): $\\tfrac{26}{50}$.\n- The **4th** ace must land in the one remaining empty pile ($13$ of $49$): $\\tfrac{13}{49}$.\n\nMultiply the conditional probabilities:\n$$P = \\frac{39}{51}\\times\\frac{26}{50}\\times\\frac{13}{49} \\approx 0.105.$$\n\nSo each player holds exactly one ace about **10.5%** of the time.",
                keyIdea: "Sequential conditioning: each new ace must fall into one of the not-yet-used piles, with shrinking favorable counts."
              },
              {
                title: "Gambler's Ruin Problem",
                difficulty: "hard",
                tags: ["difference equations", "random walk"],
                statement: "A gambler starts with \\$$i$, bets \\$1 each round, winning with prob $p$ (losing with $q = 1-p$). He stops at \\$0 (ruin) or \\$$N$ (goal). What is the probability he reaches \\$$N$?",
                hint: "Let $P_i$ be the win probability from state $i$; set up the recurrence $P_i = pP_{i+1} + qP_{i-1}$.",
                solution: "**Set up a recurrence on the state.** Let $P_i$ = probability of reaching the goal \\$$N$ starting from \\$$i$. One bet later you're at $i{+}1$ (prob $p$) or $i{-}1$ (prob $q$), so\n$$P_i = pP_{i+1} + qP_{i-1}, \\qquad P_0 = 0,\\; P_N = 1.$$\n\n**The trick to solve it:** rewrite using $p + q = 1$ so that consecutive *gaps* relate. It rearranges to\n$$P_{i+1} - P_i = \\frac{q}{p}\\,(P_i - P_{i-1}),$$\nso each gap is $\\tfrac{q}{p}$ times the previous one — the gaps form a **geometric sequence**. Summing the gaps from $0$ to $i$ and using the boundary conditions:\n$$P_i = \\begin{cases} \\dfrac{1 - (q/p)^i}{1 - (q/p)^N}, & p \\ne \\tfrac12 \\quad(\\text{biased}),\\\\[2mm] \\dfrac{i}{N}, & p = \\tfrac12 \\quad(\\text{fair}). \\end{cases}$$\n\n**Reading it:** in a fair game your chance of hitting the goal is just your fraction of the way there, $i/N$. With even a small edge against you ($q>p$), the $(q/p)^N$ term explodes and ruin becomes nearly certain — the mathematics behind why 'the house always wins.'",
                keyIdea: "A linear difference equation with boundary conditions. The ratio $q/p$ drives a geometric solution; the fair case degenerates to the linear $i/N$."
              },
              {
                title: "Basketball Scores",
                difficulty: "hard",
                tags: ["induction", "law of total probability"],
                statement: "A player takes 100 free throws. The 1st shot scores 1 point, 1st miss scores 0; thereafter the probability of a make equals the fraction of shots made so far. After the first 2 shots (one make, one miss), what is the probability the player ends with exactly 50 makes in 100 shots?",
                hint: "Let $P_{n,k}$ = prob of $k$ makes in $n$ shots. Compute small cases — the make-count is uniformly distributed.",
                solution: "**Guess via small cases, then prove.** Let $P_{n,k}$ = probability of exactly $k$ makes after $n$ shots, starting from the given state (after 2 shots: 1 make, 1 miss). After shot 3, the make-probability is $\\tfrac{1}{2}$ (one make out of two so far), so $P_{3,1} = P_{3,2} = \\tfrac12$ — both equally likely.\n\nThat hints at a beautiful pattern: **the number of makes is uniformly distributed.**\n$$P_{n,k} = \\frac{1}{n-1}, \\qquad k = 1, 2, \\dots, n-1.$$\n\n**Why it holds (induction).** Suppose it's true at step $n$. To have $k$ makes after shot $n{+}1$, either you had $k{-}1$ makes and then *made* shot $n{+}1$ (probability $\\tfrac{k-1}{n}$), or you had $k$ makes and *missed* (probability $\\tfrac{n-k}{n}$). By the law of total probability:\n$$P_{n+1,k} = \\frac{1}{n-1}\\cdot\\frac{k-1}{n} + \\frac{1}{n-1}\\cdot\\frac{n-k}{n} = \\frac{1}{n-1}\\cdot\\frac{n-1}{n} = \\frac{1}{n}.$$\nUniform again — the self-reinforcing 'make rate = current fraction' is exactly what keeps every outcome equally likely (a Pólya-urn effect).\n\nFor $n = 100$: every make-count from 1 to 99 has probability $\\tfrac{1}{99}$, so\n$$P_{100,50} = \\frac{1}{99}.$$",
                keyIdea: "A Pólya-urn-like reinforcement makes every possible make-count equally likely — the answer is uniform $\\frac{1}{n-1}$."
              },
              {
                title: "Cars on Road",
                difficulty: "medium",
                tags: ["independence", "complement"],
                statement: "On a highway the probability of seeing at least one car in 20 minutes is $609/625$. Assuming a constant arrival rate and independence across disjoint intervals, what is the probability of seeing at least one car in **5 minutes**?",
                hint: "20 minutes = four independent 5-minute intervals. Work with the no-car probabilities.",
                solution: "**Work with the 'nothing happens' probability** — it multiplies cleanly across independent intervals, whereas 'at least one' does not.\n\nA 20-minute window is four independent 5-minute windows. Let $p$ = prob of seeing a car in 5 minutes, so $1-p$ = prob of *no* car in 5 minutes. Seeing no car for the whole 20 minutes means no car in all four sub-intervals:\n$$(1-p)^4 = P(\\text{no car in 20 min}) = 1 - \\frac{609}{625} = \\frac{16}{625}.$$\n\nNotice $\\tfrac{16}{625} = \\left(\\tfrac{2}{5}\\right)^4$, so take the 4th root:\n$$1 - p = \\frac{2}{5} \\;\\Rightarrow\\; p = \\frac{3}{5}.$$",
                keyIdea: "Multiply 'nothing happens' probabilities across independent sub-intervals; take the 4th root to scale 20 min down to 5 min."
              }
            ]
          },
          {
            id: "4.4",
            title: "Discrete & Continuous Distributions",
            note: "Know the common distributions cold (uniform, binomial, Poisson, geometric, normal, exponential). **Memorylessness** of the exponential and **moment generating functions** are recurring tools.",
            problems: [
              {
                title: "Meeting Probability",
                difficulty: "medium",
                tags: ["geometric probability", "uniform"],
                statement: "Two bankers each arrive at the station at a uniformly random time between 5:00 and 6:00. Each waits 5 minutes for the other. What is the probability they meet?",
                hint: "Plot arrival times $X, Y$ on a $60\\times60$ square; they meet iff $|X - Y| \\le 5$.",
                solution: "**Turn the two arrival times into a point in a square.** Let $X, Y \\sim U[0,60]$ (minutes after 5:00) be the two arrival times. Every possible pair $(X,Y)$ is a point in a $60\\times60$ square, all equally likely — so 'probability' becomes 'area / total area'.\n\nThey **meet** exactly when their arrivals are within 5 minutes: $|X - Y| \\le 5$. That's a diagonal band through the square. The **non-meeting** region is the two corner triangles where $|X-Y| > 5$; each is a right triangle with legs $60 - 5 = 55$.\n\n$$P(\\text{meet}) = 1 - \\frac{2\\cdot \\tfrac12 (55)^2}{60^2} = 1 - \\frac{55^2}{60^2} = 1 - \\frac{121}{144} = \\frac{23}{144} \\approx 16\\%.$$",
                keyIdea: "Geometric probability: map the joint uniform pair to area in a square; the meeting band's area over the total gives the probability."
              },
              {
                title: "Probability of Triangle",
                difficulty: "hard",
                tags: ["geometric probability", "uniform"],
                statement: "A stick of length 1 is cut at two independent uniformly random points. What is the probability the three pieces can form a triangle?",
                hint: "Let the cut points be $x$ and $y$; the three pieces form a triangle iff no piece exceeds $1/2$.",
                solution: "**Translate the geometry into a condition.** Three lengths form a triangle iff no single piece is $\\ge$ half the total (the triangle inequality). With a stick of length 1, that means **every piece must be $< \\tfrac12$**.\n\nLet the two cut points be $x, y \\sim U[0,1]$, a random point in the unit square. Split on which cut is to the left:\n- If $x < y$, the pieces are $x$, $y - x$, $1 - y$. Requiring all three $< \\tfrac12$ gives $x < \\tfrac12$, $\\;y > \\tfrac12$, $\\;y - x < \\tfrac12$ — a small triangle of area $\\tfrac18$.\n- The case $x > y$ is the mirror image — another area-$\\tfrac18$ triangle.\n\nTotal favorable area $= \\tfrac18 + \\tfrac18 = \\tfrac14$ out of the unit square, so\n$$P(\\text{triangle}) = \\frac{1}{4}.$$",
                keyIdea: "Triangle inequality ⇔ every piece below $1/2$; the favorable set is $1/4$ of the $(x,y)$ unit square."
              },
              {
                title: "Property of Poisson Process",
                difficulty: "hard",
                tags: ["Poisson process", "memorylessness"],
                statement: "Buses arrive as a Poisson process with mean inter-arrival time 10 min ($\\lambda = 0.1$/min). You arrive at a random time. What is your expected waiting time for the next bus? On average, how long ago did the last bus leave?",
                hint: "Use the memorylessness of the exponential inter-arrival distribution.",
                solution: "In a Poisson process the gaps between buses are **exponential** with mean $1/\\lambda = 10$ min, and the exponential is **memoryless**: the distribution of 'time until the next event' doesn't depend on how long you've already waited.\n\nSo when you show up at a random time, the wait for the **next** bus is still exponential with mean **10 minutes** — it doesn't matter that a bus may have left moments ago. By the identical (time-reversed) argument, the time **since the last** bus also averages **10 minutes**.\n\n**The apparent paradox:** forward 10 + backward 10 = **20 minutes** for the gap you landed in — twice the 'average' gap of 10! Both are correct. The resolution is the **inspection paradox**: a randomly chosen instant is more likely to fall inside a *long* gap than a short one, so the gap you sample is biased long. (For a general distribution the expected forward wait is $\\frac{E[X^2]}{2E[X]}$, which exceeds $\\frac{E[X]}{2}$ whenever the gaps have any variance.)",
                keyIdea: "Memorylessness makes forward and backward waiting times each ~10 min; the apparent contradiction (20-min straddled interval) is the inspection paradox."
              },
              {
                title: "Moments of Normal Distribution",
                difficulty: "hard",
                tags: ["normal distribution", "moment generating function"],
                statement: "If $X \\sim N(0,1)$, find $E[X^n]$ for $n = 1, 2, 3, 4$.",
                hint: "Odd moments vanish by symmetry. For even moments use the moment generating function $M(t) = e^{t^2/2}$.",
                solution: "**Two shortcuts do all the work:** symmetry kills the odd moments, and the moment generating function (MGF) cranks out the even ones.\n\n**Odd moments ($n=1,3$):** the standard-normal density is symmetric about 0, so $x^n$ (for odd $n$) integrates to zero by cancellation. Hence $E[X] = E[X^3] = 0$.\n\n**Even moments via the MGF.** The standard normal has $M(t) = E[e^{tX}] = e^{t^2/2}$, and the $n$-th derivative at 0 gives the $n$-th moment, $M^{(n)}(0) = E[X^n]$. Differentiate:\n- $M'(t) = t\\,e^{t^2/2}$, so $M'(0) = 0$ → $E[X] = 0$.\n- $M''(t) = (1 + t^2)e^{t^2/2}$, so $M''(0) = 1$ → $E[X^2] = 1$.\n- $M'''(0) = 0$ → $E[X^3] = 0$.\n- $M^{(4)}(0) = 3$ → $E[X^4] = 3$.\n\nSo the first four moments are $\\mathbf{0,\\,1,\\,0,\\,3}$ — i.e. mean 0, variance 1, zero skew, and kurtosis 3 (the benchmark all other distributions' 'fat tails' are measured against). In general $E[X^{2k}] = (2k-1)!! = 1\\cdot3\\cdots(2k-1)$.",
                keyIdea: "MGF differentiation generates moments; for $N(0,1)$, $E[X^{2k}] = (2k-1)!!$, giving $E[X^4] = 3$."
              }
            ]
          },
          {
            id: "4.5",
            title: "Expected Value, Variance & Covariance",
            note: "Use **indicator variables** + linearity of expectation to dodge hard counting. Key identities: $\\mathrm{Var}(X) = E[X^2] - E[X]^2$, $\\mathrm{Cov}(X,Y) = E[XY] - E[X]E[Y]$, and the **law of total expectation**.",
            problems: [
              {
                title: "Connecting Noodles",
                difficulty: "medium",
                tags: ["expectation", "recursion", "induction"],
                statement: "A bowl has 100 noodles. Blindfolded, you repeatedly grab two loose ends at random and tie them together until no loose ends remain. What is the expected number of **loops** formed?",
                hint: "Start with 1 noodle, then 2. Each tie either joins two noodles or closes a loop.",
                solution: "**Set up a recursion on the number of noodles.** With $n$ noodles there are $2n$ loose ends. Grab one end (any of them) and tie it to a *random* second end. There are $2n - 1$ other ends to tie to, and exactly **one** of them is the *other end of the same noodle* — tying those two closes a **loop**.\n\nSo each tie forms a new loop with probability $\\tfrac{1}{2n-1}$, and afterward you're left with $n-1$ noodles' worth of free ends. By linearity of expectation:\n$$E[f(n)] = \\frac{1}{2n-1} + E[f(n-1)], \\qquad E[f(1)] = 1.$$\n\nUnrolling the recursion gives a sum of odd reciprocals:\n$$E[f(n)] = 1 + \\frac{1}{3} + \\frac{1}{5} + \\cdots + \\frac{1}{2n-1}.$$\n\nFor 100 noodles, $E[f(100)] = \\sum_{k=1}^{100}\\frac{1}{2k-1} \\approx 3.28$ loops. (It grows like $\\tfrac12\\ln n$ — very slowly, so even 100 noodles average only ~3 loops.)",
                keyIdea: "Each tie closes a loop with probability $\\frac{1}{2n-1}$; linearity of expectation turns the process into a harmonic-like sum."
              },
              {
                title: "Optimal Hedge Ratio",
                difficulty: "medium",
                tags: ["variance", "covariance", "optimization"],
                statement: "You own one share of stock A and short $h$ shares of B to hedge. A's return variance is $\\sigma_A^2$, B's is $\\sigma_B^2$, correlation $\\rho$. What $h$ minimizes the variance of the hedged position?",
                hint: "Write the portfolio variance as a function of $h$ and minimize.",
                solution: "Portfolio return $r_A - h r_B$ has variance\n$$\\mathrm{Var} = \\sigma_A^2 - 2h\\rho\\sigma_A\\sigma_B + h^2\\sigma_B^2.$$\nSet the derivative to zero: $\\frac{d}{dh} = -2\\rho\\sigma_A\\sigma_B + 2h\\sigma_B^2 = 0$, giving\n$$h = \\rho\\frac{\\sigma_A}{\\sigma_B}.$$\nThe second derivative $2\\sigma_B^2 > 0$ confirms a minimum.",
                keyIdea: "Minimizing a quadratic in $h$ gives the classic minimum-variance hedge ratio $\\rho\\,\\sigma_A/\\sigma_B$ — the slope of regressing A on B."
              },
              {
                title: "Dice Game",
                difficulty: "medium",
                tags: ["law of total expectation", "recursion"],
                statement: "You roll a die and are paid its face value. If the roll is 4, 5, or 6 you may roll again — keeping what you've earned and adding the new roll. You stop once you roll 1, 2, or 3. What is the expected total payoff?",
                hint: "Let $E$ be the expected payoff and condition on the first roll. You keep the 4/5/6 payment AND get to play the same game again.",
                solution: "Let $E$ be the expected payoff. Condition on the first roll $Y$ (law of total expectation):\n\n- With prob $1/2$, $Y \\in \\{1,2,3\\}$ and the game stops. Expected payment $= 2$.\n- With prob $1/2$, $Y \\in \\{4,5,6\\}$: you collect that face value (average $5$) **and** roll again, which restarts an identical game worth $E$. So this branch is worth $5 + E$.\n\nTherefore\n$$E = \\tfrac{1}{2}(2) + \\tfrac{1}{2}(5 + E) = 1 + 2.5 + 0.5E \\Rightarrow 0.5E = 3.5 \\Rightarrow E = 7.$$",
                keyIdea: "Condition on the first roll and solve the fixed-point equation. Because high rolls pay out *and* grant another turn, the expected payoff (7) far exceeds a single roll's mean (3.5)."
              },
              {
                title: "Card Game (Expected Position)",
                difficulty: "medium",
                tags: ["indicator variables", "expectation", "symmetry"],
                statement: "In a 52-card deck with 4 aces and 48 non-aces, what is the expected number of cards you turn over to see the **first ace**?",
                hint: "Use indicator variables for each non-ace: is it turned before all 4 aces?",
                solution: "**The slick move:** instead of summing over 'where is the first ace,' count, for each *non-ace*, whether it sits before all the aces. The number of cards you flip to reach the first ace is\n$$1 \\text{ (the ace itself)} + \\#\\{\\text{non-aces ahead of all 4 aces}\\}.$$\n\nFor non-ace $i$, define $X_i = 1$ if it lands before every ace. Here's the symmetry: look only at the relative order of the 5 cards {non-ace $i$ + the 4 aces}. That non-ace is equally likely to be in any of the 5 positions, and we want it *first*, so\n$$P(X_i = 1) = \\frac{1}{5}.$$\n\nNow **linearity of expectation** (which ignores the messy dependence between the $X_i$):\n$$E[\\text{cards flipped}] = 1 + \\sum_{i=1}^{48} E[X_i] = 1 + 48\\cdot\\frac{1}{5} = 1 + 9.6 = 10.6.$$\n\n(General rule: the first of $n$ special cards among $m$ ordinary ones appears at expected position $1 + \\frac{m}{n+1}$.)",
                keyIdea: "Indicator variables + symmetry: each non-ace precedes all aces with probability $1/5$; linearity of expectation finishes it without messy counting."
              },
              {
                title: "Sum of Random Variables",
                difficulty: "hard",
                tags: ["uniform", "induction", "geometry"],
                statement: "$X_1, X_2, \\dots$ are i.i.d. $U[0,1]$. What is the probability that $S_n = X_1 + \\cdots + X_n \\le 1$?",
                hint: "It's the volume of an $n$-dimensional simplex. Try $n=2,3$, find the pattern, prove by induction.",
                solution: "**Geometric picture first.** Since each $X_i \\sim U[0,1]$, the point $(X_1,\\dots,X_n)$ is uniform in the unit cube, so $P(S_n \\le 1)$ is just the **volume** of the slice $\\{x_i \\ge 0,\\; \\sum x_i \\le 1\\}$ — the standard $n$-simplex.\n\nCheck small cases: $n=2$ is a triangle of area $\\tfrac12$; $n=3$ is a tetrahedron of volume $\\tfrac16$. The pattern is\n$$P(S_n \\le 1) = \\frac{1}{n!}.$$\n\n**Prove it by induction**, peeling off the last variable. Condition on $X_{n+1} = x$: the remaining $n$ must sum to $\\le 1 - x$, which by the inductive hypothesis has probability $\\frac{(1-x)^n}{n!}$. Integrate over $x \\in [0,1]$:\n$$P(S_{n+1}\\le 1) = \\int_0^1 \\frac{(1-x)^n}{n!}\\,dx = \\frac{1}{n!}\\cdot\\frac{1}{n+1} = \\frac{1}{(n+1)!}. \\;\\checkmark$$",
                keyIdea: "The event is the volume of a simplex; conditioning on the last variable gives the clean induction $\\frac{1}{n!} \\to \\frac{1}{(n+1)!}$."
              },
              {
                title: "Coupon Collection",
                difficulty: "medium",
                tags: ["geometric distribution", "expectation"],
                statement: "There are $N$ distinct coupon types, each equally likely per box. Part A: expected number of coupons to collect a complete set? Part B: among $n$ collected coupons, the expected number of **distinct** types?",
                hint: "Part A: after collecting $i-1$ types, the wait for a new type is geometric. Part B: use an indicator for each type.",
                solution: "**Part A — break the wait into stages.** Collecting a full set happens one *new* type at a time. Suppose you already hold $i-1$ distinct types; each new box is a brand-new type with probability $\\frac{N-(i-1)}{N}$. The number of boxes $X_i$ to get that next new type is therefore **geometric**, with mean $\\frac{1}{\\text{success prob}} = \\frac{N}{N-i+1}$.\n\nAdd the stages (linearity of expectation):\n$$E[X] = \\sum_{i=1}^{N}\\frac{N}{N-i+1} = N\\Big(1 + \\tfrac12 + \\tfrac13 + \\cdots + \\tfrac1N\\Big) \\approx N\\ln N.$$\nThe harmonic sum is why the *last* few coupons take so painfully long.\n\n**Part B — use one indicator per type.** Let $I_i = 1$ if type $i$ shows up at least once in $n$ boxes. It's *missing* if all $n$ boxes avoid it: $P(I_i = 0) = \\big(\\tfrac{N-1}{N}\\big)^n$, so $P(I_i = 1) = 1 - \\big(\\tfrac{N-1}{N}\\big)^n$. Summing:\n$$E[\\#\\text{distinct types}] = N\\Big(1 - \\big(\\tfrac{N-1}{N}\\big)^n\\Big).$$",
                keyIdea: "Part A: sum of geometrics → harmonic number ($N\\ln N$). Part B: indicators + linearity, with each type missing with prob $((N-1)/N)^n$."
              },
              {
                title: "Joint Default Probability",
                difficulty: "hard",
                tags: ["covariance", "correlation", "bounds"],
                statement: "Bond A defaults next year with prob 50%, bond B with 30%, and their default correlation is 0.3. What is the probability that **at least one** defaults? And what is the range of possible correlations?",
                hint: "Write $P(A \\text{ or } B) = P(A) + P(B) - P(AB)$ and express $P(AB)$ via covariance of the default indicators.",
                solution: "**Turn 'default' into a 0/1 variable.** Let $I_A, I_B$ be indicators (1 = default). A Bernoulli with default prob $p$ has mean $p$ and variance $p(1-p)$:\n$$E[I_A]=0.5,\\; \\mathrm{Var}(I_A)=0.25; \\qquad E[I_B]=0.3,\\; \\mathrm{Var}(I_B)=0.21.$$\n\n**Step 1 — get $P(\\text{both default})$ from the correlation.** Correlation × the two standard deviations gives covariance, and covariance unwinds to the joint probability:\n$$\\mathrm{Cov} = \\rho\\sqrt{\\mathrm{Var}(I_A)\\mathrm{Var}(I_B)} = 0.3\\sqrt{0.25\\cdot0.21} \\approx 0.0687,$$\n$$P(AB) = \\mathrm{Cov} + E[I_A]E[I_B] = 0.0687 + 0.15 = 0.2187.$$\n\n**Step 2 — inclusion–exclusion for 'at least one.'**\n$$P(A \\text{ or } B) = P(A) + P(B) - P(AB) = 0.5 + 0.3 - 0.2187 \\approx 0.581.$$\n\n**Bonus — correlation can't be anything.** $P(AB)$ is squeezed between $\\max(0, p_A{+}p_B{-}1)=0$ and $\\min(p_A,p_B)=0.3$. Converting those bounds back through the covariance formula limits the achievable correlation to roughly $\\rho \\in [-0.655,\\, 0.655]$ — so a default correlation of, say, 0.9 would be mathematically impossible for these two bonds.",
                keyIdea: "Default indicators turn correlation into covariance, pinning down $P(AB)$; admissible joint probabilities bound the achievable correlation."
              }
            ]
          },
          {
            id: "4.6",
            title: "Order Statistics",
            note: "For i.i.d. $X_1,\\dots,X_n$: the max has cdf $F_Z(x) = F(x)^n$ and the min has $F_W(x) = 1-(1-F(x))^n$. Differentiate for densities, then integrate for moments.",
            problems: [
              {
                title: "Expected Value of Max and Min",
                difficulty: "medium",
                tags: ["order statistics", "uniform"],
                statement: "$X_1,\\dots,X_n$ are i.i.d. $U[0,1]$. Find the expected value of the maximum $Z = \\max(X_i)$ and the minimum $W = \\min(X_i)$.",
                hint: "Find the cdf of the max ($F(x)^n$), differentiate to a density, then integrate.",
                solution: "**The cdf trick for extremes.** The maximum is $\\le x$ **iff every** sample is $\\le x$, so its cdf is $F(x)^n$. The minimum is $> x$ **iff every** sample is $> x$, giving the min cdf $1 - (1-F(x))^n$. For $U[0,1]$, $F(x) = x$.\n\n**Maximum.** cdf $F_Z(x) = x^n$ → density $f_Z(x) = nx^{n-1}$:\n$$E[Z] = \\int_0^1 x\\cdot nx^{n-1}\\,dx = \\frac{n}{n+1}.$$\n\n**Minimum.** cdf $1-(1-x)^n$ → density $n(1-x)^{n-1}$:\n$$E[W] = \\int_0^1 x\\cdot n(1-x)^{n-1}\\,dx = \\frac{1}{n+1}.$$\n\n**Sanity check with a nice picture:** $n$ random points drop $[0,1]$ into $n+1$ gaps, and by symmetry each gap averages $\\frac{1}{n+1}$. So the min sits at $\\frac{1}{n+1}$ and the max at $1 - \\frac{1}{n+1} = \\frac{n}{n+1}$ — exactly what the integrals gave.",
                keyIdea: "Max cdf is $F^n$, min cdf is $1-(1-F)^n$; for the uniform the expectations are $\\frac{n}{n+1}$ and $\\frac{1}{n+1}$."
              },
              {
                title: "Correlation of Max and Min",
                difficulty: "hard",
                tags: ["order statistics", "covariance", "correlation"],
                statement: "$X_1, X_2$ i.i.d. $U[0,1]$. Let $Y = \\min(X_1,X_2)$ and $Z = \\max(X_1,X_2)$. What is the correlation of $Y$ and $Z$?",
                hint: "Get the marginal densities of $Y$ and $Z$ for $n=2$, then compute $E[YZ]$ using $YZ = X_1 X_2$.",
                solution: "Plan: get the means and variances of the min $Y$ and max $Z$, then their covariance, then divide. The one clever shortcut is for $E[YZ]$.\n\n**Densities for $n=2$** (from the max/min cdfs): $f_Y(y) = 2(1-y)$ and $f_Z(z) = 2z$. So $E[Y]=\\tfrac13$, $E[Z]=\\tfrac23$, and\n$$E[Y^2] = \\int_0^1 y^2\\cdot 2(1-y)\\,dy = \\tfrac16 \\Rightarrow \\mathrm{Var}(Y) = \\tfrac16 - \\tfrac19 = \\tfrac{1}{18},$$\n$$E[Z^2] = \\int_0^1 z^2\\cdot 2z\\,dz = \\tfrac12 \\Rightarrow \\mathrm{Var}(Z) = \\tfrac12 - \\tfrac49 = \\tfrac{1}{18}.$$\n\n**The shortcut for $E[YZ]$:** the min times the max equals the product of the *original* two values — $\\min\\cdot\\max = X_1 X_2$ — so no integral is needed:\n$$E[YZ] = E[X_1]E[X_2] = \\tfrac12\\cdot\\tfrac12 = \\tfrac14.$$\n\nThen $\\mathrm{Cov}(Y,Z) = \\tfrac14 - \\tfrac13\\cdot\\tfrac23 = \\tfrac{1}{36}$, and\n$$\\mathrm{corr}(Y,Z) = \\frac{1/36}{\\sqrt{(1/18)(1/18)}} = \\frac{1}{2}.$$\n\nThe positive $+\\tfrac12$ makes sense: a large minimum drags the maximum up with it, so they move together.",
                keyIdea: "Use $\\min\\cdot\\max = X_1X_2$ to get $E[YZ]$ for free; the positive correlation ($1/2$) reflects that a large min forces a large max."
              },
              {
                title: "Random Ants",
                difficulty: "hard",
                tags: ["symmetry", "order statistics", "expectation"],
                statement: "500 ants are placed uniformly at random on a 1-foot string, each facing a random direction, all moving at 1 ft/min. Colliding ants instantly reverse direction. What is the expected time for all ants to fall off the string?",
                hint: "When two ants collide and reverse, it's the same as if they passed through each other — just swap labels.",
                solution: "**The trick that dissolves the whole mess:** when two ants collide and reverse, picture them as two identical tokens *passing straight through* each other instead. Nothing observable changes — same set of positions and directions, just with the labels swapped. So you can pretend collisions **never happen**: every ant marches straight at 1 ft/min until it walks off an end.\n\nNow it's easy. The last ant to leave is whichever one has the **farthest to travel** in its (random) direction — the *maximum* distance-to-fall over all 500 ants. With ants placed uniformly on the 1-foot string and (by symmetry) each effectively needing to cover up to a $U[0,1]$ distance, the time for *all* of them to be gone is the expected maximum of 500 i.i.d. $U[0,1]$ values:\n$$E[\\text{time}] = \\frac{n}{n+1} = \\frac{500}{501} \\approx 0.998 \\text{ minutes}.$$\n\nSo despite 500 ants frantically bouncing off each other, they're all gone in just under a minute.",
                keyIdea: "Pass-through relabeling removes collisions entirely; the answer becomes the expected max of i.i.d. uniforms, $\\frac{n}{n+1}$."
              }
            ]
          }
        ]
      },
      {
        num: 5,
        title: "Stochastic Process & Calculus",
        blurb: "Markov chains, martingales and random walks, dynamic programming, Brownian motion and Itô's lemma.",
        topics: [
          {
            id: "5.1",
            title: "Markov Chain",
            note: "A process with the **Markov property**: the future depends only on the present state, not the past. The art is **choosing the right state space**, then writing transition / absorption equations.",
            problems: [
              {
                title: "Gambler's Ruin Problem",
                difficulty: "medium",
                tags: ["Markov chain", "absorbing states"],
                statement: "Player M has \\$1, player N has \\$2. Each game the winner takes \\$1 from the loser; M wins each game with probability $2/3$. They play until one is bankrupt. What is the probability M wins (ends with all \\$3)?",
                hint: "The total money is fixed at \\$3, so the state is just M's holdings $m \\in \\{0,1,2,3\\}$. States 0 and 3 are absorbing.",
                solution: "**Pick the right state.** The two players' fortunes always add to \\$3, so you don't need to track both — just **M's money**, $m \\in \\{0,1,2,3\\}$. States 0 (M broke) and 3 (M has it all) are *absorbing* — the game ends there.\n\nLet $a_m$ = probability M eventually wins, starting from \\$$m$, with boundaries $a_0 = 0$ and $a_3 = 1$. From an interior state M goes up \\$1 with prob $\\tfrac23$ and down with $\\tfrac13$, so each $a_m$ is the weighted average of its neighbors:\n$$a_1 = \\tfrac{1}{3}a_0 + \\tfrac{2}{3}a_2, \\qquad a_2 = \\tfrac{1}{3}a_1 + \\tfrac{2}{3}a_3.$$\n\nSubstitute the boundaries and solve the two equations: $a_2 = \\tfrac67$, $a_1 = \\tfrac47$. M starts with \\$1, so\n$$P(\\text{M wins}) = a_1 = \\frac{4}{7}.$$\nSensibly above $\\tfrac12$ — M has the per-game edge, so even starting poorer (\\$1 vs \\$2) M is favored to sweep.",
                keyIdea: "Reduce the 2-D money state to 1-D (M's holdings sum to a constant), then solve linear absorption equations with the two boundary conditions."
              },
              {
                title: "Dice Question",
                difficulty: "medium",
                tags: ["Markov chain", "conditional probability"],
                statement: "Two players roll two dice repeatedly. Player A bets a sum of **12** will appear before two consecutive **7s**; player B bets two consecutive 7s come first. What is the probability A wins?",
                hint: "Condition on the first roll's sum (12, 7, or other). 'Two consecutive 7s' needs a state tracking 'last roll was a 7'.",
                solution: "**Why this needs a state, not just one probability:** 'two consecutive 7s' means the danger only exists *right after* a 7 was just rolled. So there are really two situations — a fresh roll, and 'the last roll was a 7' — and we condition accordingly. The relevant single-roll odds: $P(\\text{sum}=12)=\\tfrac{1}{36}$, $P(\\text{sum}=7)=\\tfrac{6}{36}$, $P(\\text{neither})=\\tfrac{29}{36}$.\n\nLet $P(A)$ be A's win probability from a fresh roll. Condition on that roll:\n- **12** ($\\tfrac1{36}$): A wins immediately.\n- **neither** ($\\tfrac{29}{36}$): nothing changes, back to a fresh roll → contributes $P(A)$.\n- **7** ($\\tfrac{6}{36}$): now we're 'one 7 in.' Look at the *next* roll: a 12 ($\\tfrac1{36}$) wins for A; a second 7 ($\\tfrac6{36}$) wins for B; anything else returns to a fresh roll worth $P(A)$.\n\nAssemble the equation and solve:\n$$P(A) = \\tfrac{1}{36} + \\tfrac{29}{36}P(A) + \\tfrac{6}{36}\\Big[\\tfrac{1}{36} + \\tfrac{29}{36}P(A)\\Big] \\;\\Rightarrow\\; P(A) = \\frac{7}{13}.$$\n\nSo betting on the **single 12 before the double-7** is the slightly better side ($\\tfrac{7}{13} > \\tfrac12$) — a 12 is rare, but needing *two* 7s in a row is even harder to pull off.",
                keyIdea: "Consolidate equivalent positions into a few states ('start' vs 'just rolled a 7'); set up a self-referential equation and solve."
              },
              {
                title: "Coin Triplets",
                difficulty: "hard",
                tags: ["Markov chain", "expected value", "non-transitive"],
                statement: "Part A: Expected number of fair-coin tosses to first see **HHH** in a row? And to first see **THH**? Part B: Probability that **HHH** occurs before **THH** in the sequence? Part C: In a game where each player picks a triplet and the first to appear wins, would you go first or second?",
                hint: "Build a Markov chain over the 'progress so far' states (S, H, HH, HHH). For Part B/C think about what must precede HHH.",
                solution: "**Part A — expected waiting times.** Set up a tiny Markov chain over 'how much of the target you've built so far' (states like $\\varnothing, H, HH, HHH$) and solve the expected-steps-to-absorption equations:\n- to **HHH**: $E = 14$ tosses.\n- to **THH**: $E = 8$ tosses.\n\nWhy the gap? With HHH, a single tail anywhere wipes out *all* your progress back to zero. With THH, the leading T is 'easy' and the HH is protected — a stray T just re-arms the start, so it recovers far better.\n\n**Part B — which comes first?** $P(\\text{HHH before THH}) = \\tfrac{1}{8}$. The clean argument: unless the very first three tosses are $HHH$ (probability $(\\tfrac12)^3 = \\tfrac18$), *some* tail appears before you ever complete three heads — and the toss right before your eventual HHH run would be a T, which means **THH already occurred first**. So HHH wins only by sprinting out of the gate: $\\tfrac18$.\n\n**Part C — go second.** This game is **non-transitive** (Penney's game): there is no single 'best' triplet, so the second player has the advantage. Whatever triplet the first player names, you build a triplet that beats it by taking *their first two symbols as your last two* and prepending a well-chosen symbol — that gives you $>\\tfrac12$ (often $\\tfrac23$ or more). **Always choose to go second.**",
                keyIdea: "Markov-chain absorption gives the expected waiting times; the non-transitivity (like Penney's game) means the second mover always has an edge."
              },
              {
                title: "Color Balls",
                difficulty: "hard",
                tags: ["Markov chain", "symmetry", "expected value"],
                statement: "A box has $n$ balls of $n$ different colors. Repeatedly pick a random pair, repaint the first to match the second, and return both. What is the expected number of steps until all balls are the same color?",
                hint: "By symmetry, condition on the final color being color 1, and track only the count of color-1 balls as a Markov chain.",
                solution: "**Cut the state space down with symmetry.** All colors are interchangeable, so condition on the final color being color 1 and just track $c$ = the number of color-1 balls. The states are $0,1,\\dots,n$, and only $c = n$ (all color 1) is absorbing.\n\n**Find the step probabilities.** A step changes $c$ only when you pick one color-1 ball and one non-color-1 ball, then repaint:\n- $c$ goes **up by 1** if the repainted (first) ball is a non-color-1 made to match a color-1 model,\n- $c$ goes **down by 1** in the mirror case,\n- otherwise $c$ is unchanged.\n\nBoth the up and down moves have the *same* probability $\\frac{c(n-c)}{n(n-1)}$, so this is a **symmetric** birth–death chain — like an unbiased random walk that pauses sometimes.\n\nSetting up and solving the expected-steps-to-absorption equations (with the relevant boundary) collapses to the clean closed form\n$$E[\\text{steps}] = (n-1)^2.$$",
                keyIdea: "Symmetry collapses the state to a single count; the up/down transition probabilities are equal, yielding the clean closed form $(n-1)^2$."
              }
            ]
          },
          {
            id: "5.2",
            title: "Martingale & Random Walk",
            note: "A **martingale** has $E[\\text{future} \\mid \\text{past}] = \\text{present}$. Optional stopping + **Wald's equality** ($E[S_N] = E[X]E[N]$) and the **reflection principle** crack most of these elegantly.",
            problems: [
              {
                title: "Drunk Man",
                difficulty: "hard",
                tags: ["random walk", "martingale", "optional stopping"],
                statement: "A drunk man is at the 17-meter mark of a 100-meter bridge. Each step he moves ±1 meter with probability 1/2 each. What is the probability he reaches the far end (100 m) before falling off the near end (0 m)? What is the expected number of steps to reach either end?",
                hint: "$S_n$ and $S_n^2 - n$ are both martingales for a symmetric random walk. Apply optional stopping at the two boundaries.",
                solution: "Two martingales do all the work — one for the *probability*, one for the *time*. The start is position 17, with absorbing ends at 0 and 100.\n\n**Probability of reaching 100.** The position $S_n$ is a **martingale** (each step is $\\pm1$ with equal odds, so the expected position never drifts). Optional stopping says the expected position when he stops equals where he started:\n$$E[S_{\\text{end}}] = 17.$$\nHe stops at 100 (prob $p$) or 0 (prob $1-p$), so $100p + 0 = 17 \\Rightarrow p = 0.17$. **17% chance** he reaches the far end first.\n\n**Expected number of steps.** Here's the trick: $S_n^2 - n$ is *also* a martingale. Optional stopping gives $E[S_{\\text{end}}^2 - N] = S_0^2 = 17^2$, i.e. $E[N] = E[S_{\\text{end}}^2] - 289$. Since $S_{\\text{end}}$ is 100 (prob 0.17) or 0, $E[S_{\\text{end}}^2] = 100^2(0.17) = 1700$, so\n$$E[N] = 1700 - 289 = 1441 \\text{ steps}.$$\n\n(General symmetric walk between $-\\beta$ and $\\alpha$: reach-$\\alpha$ probability is $\\frac{\\beta}{\\alpha+\\beta}$ and expected steps $\\alpha\\beta$ — no difference equations needed.)",
                keyIdea: "Two martingales ($S_n$ for the hitting probability, $S_n^2-n$ for the expected time) plus optional stopping deliver both answers without solving difference equations."
              },
              {
                title: "Dice Game (Wald's Equality)",
                difficulty: "medium",
                tags: ["Wald's equality", "stopping time"],
                statement: "You roll a die and are paid the face value; if you roll 4, 5, or 6 you may roll again (keeping winnings); you stop on 1, 2, or 3. What is the expected total payoff? (Solve via stopping rules.)",
                hint: "The number of rolls $N$ is geometric with stopping probability 1/2; apply Wald's equality.",
                solution: "Each roll has expected value $E[X] = 3.5$. The game stops on $\\{1,2,3\\}$, probability $1/2$ each roll, so the number of rolls $N$ is geometric with $E[N] = 1/p = 2$. By **Wald's equality**:\n$$E[\\text{payoff}] = E[X]\\,E[N] = 3.5 \\times 2 = 7.$$",
                keyIdea: "Wald's equality cleanly multiplies the per-roll mean by the expected number of rolls — no recursion needed."
              },
              {
                title: "Ticket Line",
                difficulty: "hard",
                tags: ["reflection principle", "ballot problem", "counting"],
                statement: "At a box office, $2n$ people queue: $n$ have only \\$5 bills, $n$ have only \\$10 bills. A ticket costs \\$5 and the seller starts with no change. What is the probability everyone can buy a ticket without anyone having to wait for change?",
                hint: "Map \\$5-holders to +1 steps and \\$10-holders to −1 steps. You need a path that never goes negative — use the reflection principle.",
                solution: "Encode \\$5 as $+1$, \\$10 as $-1$; the seller can always make change iff the running sum **never goes negative**. Total paths from $(0,0)$ to $(2n,0)$: $\\binom{2n}{n}$. By the **reflection principle**, the number of 'bad' paths (touching $-1$) equals $\\binom{2n}{n-1}$. So the good paths number\n$$\\binom{2n}{n} - \\binom{2n}{n-1} = \\frac{1}{n+1}\\binom{2n}{n}$$\n(a Catalan number). The probability is\n$$P = \\frac{1}{n+1}.$$",
                keyIdea: "The reflection principle counts lattice paths that stay non-negative; the answer is the Catalan ratio $\\frac{1}{n+1}$."
              },
              {
                title: "Coin Sequence",
                difficulty: "hard",
                tags: ["martingale", "expected value", "induction"],
                statement: "For a fair coin, what is the expected number of tosses to get $n$ heads **in a row**?",
                hint: "Find the pattern from $n=1,2,3$ (2, 6, 14), or use a 'gambler' martingale argument over stopping times.",
                solution: "Let $E[f(n)]$ be the expected tosses for $n$ heads in a row. From the Markov chain: $E[f(1)]=2$, $E[f(2)]=6$, $E[f(3)]=14$. Each extra head requires reaching $(n)$ heads (cost $E[f(n)]$) then one more toss that, half the time, fails and restarts the last segment:\n$$E[f(n+1)] = E[f(n)] + \\tfrac{1}{2}\\cdot 1 + \\tfrac{1}{2}\\big(1 + E[f(n+1)]\\big) \\Rightarrow E[f(n+1)] = 2E[f(n)] + 2.$$\nSolving gives the closed form\n$$E[f(n)] = 2^{n+1} - 2.$$\n\n**Martingale view:** imagine a gambler entering at each toss betting \\$1 that the next $n$ are all heads (doubling on each win). When the streak completes, the total wealth left in the game equals $2^n + 2^{n-1} + \\cdots + 2 = 2^{n+1}-2$, which must equal the expected number of tosses (a fair game).",
                keyIdea: "Either a doubling recurrence or a fair-betting martingale gives $E = 2^{n+1}-2$ — exponential, not linear, in $n$."
              }
            ]
          },
          {
            id: "5.3",
            title: "Dynamic Programming",
            note: "**Principle of optimality**: an optimal policy's tail is optimal for the tail subproblem. Start at the **final** stage and work **backward**, computing the cost-to-go at each state.",
            problems: [
              {
                title: "Dynamic Programming (DP) Algorithm",
                difficulty: "medium",
                tags: ["dynamic programming", "concept"],
                statement: "Describe the dynamic programming algorithm: what are its ingredients and how does it find the optimal policy?",
                hint: "Think of a multi-stage system with states, decisions, and an additive cost; then the Principle of Optimality.",
                solution: "A discrete-time DP problem has two ingredients:\n1. **A state-transition system**: stages $0,1,\\dots,N$; at stage $k$ the state $x_k$ transitions via $x_{k+1} = f(x_k, u_k, w_k)$, where $u_k$ is your decision and $w_k$ a random disturbance.\n2. **An additive cost**: total cost $g_N(x_N) + \\sum_{k=0}^{N-1} g_k(x_k, u_k, w_k)$.\n\n**Principle of Optimality:** if $\\{u_0^*,\\dots,u_{N-1}^*\\}$ is optimal overall, its tail $\\{u_k^*,\\dots,u_{N-1}^*\\}$ is optimal for the subproblem starting at stage $k$.\n\n**Algorithm (backward induction):** set $J_N(x_N) = g_N(x_N)$, then for $k = N-1,\\dots,0$ compute\n$$J_k(x_k) = \\min_{u_k} E\\big[g_k(x_k,u_k,w_k) + J_{k+1}(f(x_k,u_k,w_k))\\big].$$\nThen $J_0(x_0)$ is the optimal expected cost, and the minimizing $u_k$ at each state is the optimal policy.",
                keyIdea: "Solve the easy last stage first, then roll the optimal cost-to-go backward. Each interview DP problem is just identifying the states, decisions, and additive payoff."
              },
              {
                title: "Dice Game (Up to 3 Rolls)",
                difficulty: "medium",
                tags: ["dynamic programming", "expected value"],
                statement: "You may roll a die up to 3 times. After the 1st or 2nd roll you may either take \\$$x$ (the face value) or roll again; you forgo the previous number. On the 3rd roll you must take whatever you get. What is your optimal strategy and the game's value?",
                hint: "Work backward from the last roll.",
                solution: "**Backward induction:**\n- **3rd roll** (must accept): expected value $3.5$.\n- **After 2nd roll:** keep if face $> 3.5$, i.e. keep 4,5,6; else roll. Expected payoff $= \\tfrac{1}{6}(4+5+6) + \\tfrac{3}{6}(3.5) = \\tfrac{15}{6} + 1.75 = 4.25$.\n- **After 1st roll:** keep if face $> 4.25$, i.e. keep 5 or 6; else roll. Expected payoff $= \\tfrac{1}{6}(5+6) + \\tfrac{4}{6}(4.25) = \\tfrac{11}{6} + \\tfrac{17}{6} = \\tfrac{28}{6} = \\tfrac{14}{3} \\approx 4.67$.\n\n**Value of the game = \\$$14/3 \\approx 4.67$**: keep 5–6 on roll 1, keep 4–6 on roll 2, accept roll 3.",
                keyIdea: "Compute each stage's continuation value first; accept only when the current face beats the expected value of rolling on."
              },
              {
                title: "World Series",
                difficulty: "hard",
                tags: ["dynamic programming", "replication", "binomial tree"],
                statement: "Two teams play a best-of-7 series (first to 4 wins). You have \\$100 and want to bet so that if team R wins the series you net **+\\$100**, and if R loses you net **−\\$100**. You can only bet on individual games (not the series). How much do you bet at each state?",
                hint: "Let $f(i,j)$ be your target net payoff when R has $i$ wins and the opponent $j$. Work backward from the series-ending states.",
                solution: "Let $f(i,j)$ be the net payoff you must have at state $(i,j)$. Terminal states: $f(4,\\cdot) = +100$, $f(\\cdot,4) = -100$. Each game is a fair 50/50 outcome, so by no-arbitrage replication\n$$f(i,j) = \\frac{f(i+1,j) + f(i,j+1)}{2},$$\nand the bet placed on the next game is\n$$y = \\frac{f(i+1,j) - f(i,j+1)}{2}.$$\nWorking backward, $f(0,0) = 0$ (a fair game costs nothing) and the bet at the start is $f(3,3)$-type deltas — \\$31.25 on the first game. **This is exactly delta-hedging in a binomial tree**: the per-game bet is the option's delta, and European/American options are priced the same way numerically.",
                keyIdea: "Replicate a series-level payoff with game-level bets via backward induction — the recombining tree is the binomial option-pricing model in disguise."
              },
              {
                title: "Dynamic Dice Game",
                difficulty: "hard",
                tags: ["dynamic programming", "optimal stopping"],
                statement: "A casino lets you roll a die repeatedly: after each roll you've accumulated \\$(face value of 1→\\$1, 2→\\$2, …, 5→\\$5); but if you ever roll a **6**, you lose everything and stop. After each roll you decide to keep the money or roll again. How much would you pay to play (risk-neutral)?",
                hint: "If you have \\$$n$, compare the expected value of one more roll against keeping \\$$n$. There's a threshold.",
                solution: "From an accumulated \\$$n$, rolling again has expected payoff\n$$\\tfrac{1}{6}(n+1) + \\tfrac{1}{6}(n+2) + \\cdots + \\tfrac{1}{6}(n+5) + \\tfrac{1}{6}(0) = \\tfrac{5}{6}n + 2.5.$$\nYou should roll again while this exceeds $n$, i.e. while $\\tfrac{5}{6}n + 2.5 > n \\Rightarrow n < 15$. So **stop once you reach \\$15 or more**. Define $E[f(n)]$ as the value given the stopping rule; for $n \\le 14$, $E[f(n)] = \\tfrac{1}{6}\\sum_{i=1}^{5} E[f(n+i)]$. Solving backward from the boundary gives $E[f(0)] \\approx 6.15$.\n\n**Pay at most \\$6.15.**",
                keyIdea: "Optimal stopping: continue while the expected gain from another roll beats the sure amount; the threshold (\\$15) gives a backward recursion for the game's value."
              },
              {
                title: "Dynamic Card Game",
                difficulty: "hard",
                tags: ["dynamic programming", "optimal stopping", "American option"],
                statement: "A 52-card deck (26 red, 26 black) is shuffled; cards are drawn without replacement. For each **red** drawn you win \\$1, for each **black** you lose \\$1. You may tell the dealer to **stop** at any time. What is the optimal stopping rule and the game's value?",
                hint: "Let $f(b,r)$ be the value with $b$ black and $r$ red cards left in the deck. Compare stopping (current payoff) vs. continuing.",
                solution: "Let $(b,r)$ be the black/red cards remaining. Note the payoff so far = (reds drawn − blacks drawn) = $b - r$ (since 26 of each total). At each state you choose the max of stopping or continuing:\n$$E[f(b,r)] = \\max\\!\\Big(\\,b - r,\\ \\tfrac{b}{b+r}E[f(b-1,r)] + \\tfrac{r}{b+r}E[f(b,r-1)]\\Big),$$\nwith boundaries $f(0,r) = 0$ and $f(b,0) = b$. Solving this recursion gives the value at the start:\n$$E[f(26,26)] \\approx \\$2.62.$$\nThis is precisely the valuation of an **American option** — at each state you decide whether to exercise (stop) now.",
                keyIdea: "An optimal-stopping DP identical in form to American-option pricing: at every state, take the larger of immediate exercise (stop) and continuation value."
              }
            ]
          },
          {
            id: "5.4",
            title: "Brownian Motion & Stochastic Calculus",
            note: "$W(0)=0$, independent normal increments $W(t)-W(s) \\sim N(0, t-s)$. Key martingales: $W(t)^2 - t$ and $\\exp(\\lambda W(t) - \\tfrac12\\lambda^2 t)$. **Itô's lemma** is the chain rule with a second-order $\\tfrac12 f'' \\,dt$ term.",
            problems: [
              {
                title: "Brownian Motion (Definition & Properties)",
                difficulty: "medium",
                tags: ["Brownian motion", "martingale", "covariance"],
                statement: "Define Brownian motion and list its key properties. Then: what is the correlation of $B_t$ and $B_t^2$? And what is $P(B_1 > 0, B_2 < 0)$?",
                hint: "Use symmetry for the correlation; for the joint sign probability, condition on $B_1$ and use independent increments.",
                solution: "**Definition.** $W(t)$ is a Brownian motion if (1) $W(0) = 0$; (2) increments over non-overlapping intervals are **independent**; (3) each increment is normal, $W(t)-W(s) \\sim N(0, t-s)$; and paths are continuous. Handy consequences: $E[W(t)] = 0$, $E[W(t)^2] = t$, it's a **martingale**, $\\mathrm{Cov}(W(s),W(t)) = \\min(s,t)$, and the future depends only on the present (Markov). Two martingales worth memorizing: $W(t)^2 - t$ and $\\exp\\!\\big(\\lambda W(t) - \\tfrac12\\lambda^2 t\\big)$.\n\n**Correlation of $B_t$ and $B_t^2$.** $B_t \\sim N(0,t)$ is symmetric about 0, so its odd moments vanish: $E[B_t] = 0$ and $E[B_t^3] = 0$. Then\n$$\\mathrm{Cov}(B_t, B_t^2) = E[B_t^3] - E[B_t]E[B_t^2] = 0 - 0 = 0.$$\nSo **correlation $= 0$** — they're uncorrelated, even though clearly *not* independent ($B_t^2$ is a function of $B_t$!). A clean reminder that zero correlation ≠ independence.\n\n**$P(B_1 > 0,\\, B_2 < 0)$.** Split $B_2 = B_1 + (B_2 - B_1)$, where the increment $B_2 - B_1 \\sim N(0,1)$ is **independent** of $B_1 \\sim N(0,1)$. By symmetry both are mean-zero and the picture in the $(B_1,\\,B_2{-}B_1)$ plane is symmetric across both axes and the diagonals. Counting the symmetric regions, the event '$B_1>0$ and $B_2<0$' occupies exactly **one-eighth** of the probability:\n$$P(B_1 > 0,\\, B_2 < 0) = \\frac{1}{8}.$$",
                keyIdea: "Symmetry kills odd moments (giving zero correlation); independent increments + symmetry partition the plane into 8 equal-probability regions, so the joint-sign probability is 1/8."
              },
              {
                title: "Stopping Time / First Passage Time",
                difficulty: "hard",
                tags: ["stopping time", "martingale", "reflection"],
                statement: "Part A: Mean stopping time for a Brownian motion to first reach +1 or −1? Part B: For first passage to level $x>0$, what is the density of the passage time $\\tau_x$ and its expected value? Part C: $dX = dW$; if $X$ starts at 0, what is the probability it hits 3 before −5?",
                hint: "$B_t^2 - t$ is a martingale (Part A). For Part C, use that $B_t$ is a martingale and apply optional stopping; the exponential martingale gives passage probabilities.",
                solution: "**Part A — expected time to hit $\\pm1$.** Use the martingale $B_t^2 - t$. Optional stopping gives $E[B_T^2 - T] = 0$, so $E[T] = E[B_T^2]$. At the stopping time the process is at $+1$ or $-1$, so $B_T^2 = 1$ either way. Hence\n$$E[T] = 1.$$\n\n**Part B — distribution of the first-passage time to level $x$.** The **reflection principle** says the chance of having *touched* level $x$ by time $t$ is twice the chance of being above $x$ at time $t$:\n$$P(\\tau_x \\le t) = 2\\,P\\big(W(t) \\ge x\\big) = 2\\big(1 - \\Phi(x/\\sqrt t)\\big).$$\nDifferentiate in $t$ to get the density:\n$$f_{\\tau_x}(t) = \\frac{x}{\\sqrt{2\\pi}\\,t^{3/2}}\\,e^{-x^2/(2t)}.$$\nStriking fact: this tail is so heavy that $E[\\tau_x] = \\infty$ — Brownian motion reaches *any* level with probability 1, yet the **average** time to do so is infinite.\n\n**Part C — hit 3 before −5.** With no drift, $X = B$ is a martingale, so by optional stopping its expected stopping value equals its start, 0:\n$$3\\,p + (-5)(1-p) = 0 \\;\\Rightarrow\\; p = \\frac{5}{8}.$$\n(Same $\\frac{\\beta}{\\alpha+\\beta}$ rule as the discrete random walk — the continuous limit gives the identical boundary-hitting probability.)",
                keyIdea: "$B_t^2 - t$ gives expected hitting times; the reflection principle gives the first-passage density; optional stopping of $B_t$ itself gives boundary-hitting probabilities $\\frac{\\beta}{\\alpha+\\beta}$."
              },
              {
                title: "Itô's Lemma",
                difficulty: "hard",
                tags: ["Ito's lemma", "martingale"],
                statement: "Itô's lemma: $df = \\big(\\partial_t f + \\mu\\,\\partial_x f + \\tfrac12\\sigma^2 \\partial_{xx} f\\big)dt + \\sigma\\,\\partial_x f\\,dW$. Use it: (A) Is $Z_t = \\sqrt{t}\\,B_t$ a martingale? (B) Is $W(t)^3$ a martingale?",
                hint: "A process is a martingale iff its drift (the $dt$ coefficient) is zero. Apply Itô's lemma and inspect the drift.",
                solution: "**The test to remember:** a process is a martingale **iff its drift — the $dt$ coefficient — is identically zero.** So apply Itô's lemma, read off the $dt$ term, and check whether it vanishes. (The extra $\\tfrac12\\sigma^2\\partial_{xx}f\\,dt$ term is the one ordinary calculus misses and the usual reason a 'nice-looking' process *fails* to be a martingale.)\n\n**(A) $Z_t = \\sqrt t\\,B_t$.** Here $f(B,t) = \\sqrt t\\,B$, so $\\partial_t f = \\tfrac{1}{2}t^{-1/2}B$, $\\partial_B f = \\sqrt t$, $\\partial_{BB}f = 0$. Itô gives\n$$dZ_t = \\underbrace{\\tfrac{1}{2}t^{-1/2}B_t}_{\\text{drift}}\\,dt + \\sqrt t\\,dB_t.$$\nThe drift is $\\tfrac12 t^{-1/2}B_t$, which is nonzero whenever $B_t \\ne 0$ (i.e. with probability 1). **Not a martingale.**\n\n**(B) $W(t)^3$.** Here $f = W^3$, so $\\partial_t f = 0$, $\\partial_W f = 3W^2$, $\\partial_{WW}f = 6W$. The crucial second-order term is $\\tfrac12(6W) = 3W$:\n$$d(W^3) = \\underbrace{3W_t}_{\\text{drift}}\\,dt + 3W_t^2\\,dW_t.$$\nDrift $3W_t \\ne 0$ (prob 1). **Not a martingale** — even though $W^3$ 'looks' centered, that Itô second-order term tilts it.",
                keyIdea: "Itô's lemma adds a $\\tfrac12 f''\\,dt$ term beyond the ordinary chain rule. Zero drift ⇔ martingale; both $\\sqrt t\\,B_t$ and $W^3$ have nonzero drift, so neither qualifies."
              }
            ]
          }
        ]
      },
      {
        num: 6,
        title: "Finance",
        blurb: "Option pricing, Black-Scholes, the Greeks, exotic options, and core finance questions (VaR, duration, forwards).",
        topics: [
          {
            id: "6.1",
            title: "Option Pricing",
            note: "Notation: $S$ = stock price, $K$ = strike, $\\tau = T-t$ = time to maturity, $r$ = risk-free rate, $\\sigma$ = volatility, $c/p$ = European call/put, $C/P$ = American call/put.",
            problems: [
              {
                title: "Price Direction of Options",
                difficulty: "medium",
                tags: ["option pricing", "comparative statics"],
                statement: "How do vanilla European/American option prices move as each of $S$ (stock price), $K$ (strike), $\\tau$ (time to maturity), $\\sigma$ (volatility), $r$ (rate), and $D$ (dividends) increases?",
                hint: "Reason from each option's payoff $\\max(S-K,0)$ or $\\max(K-S,0)$, then think about discounting and optionality.",
                solution: "Reason payoff-first, one variable at a time (holding others fixed).\n\n- **Stock price $S\\uparrow$:** calls gain (you buy at a fixed $K$), puts lose. **Call ↑, Put ↓.**\n- **Strike $K\\uparrow$:** the opposite — a higher strike hurts calls, helps puts. **Call ↓, Put ↑.**\n- **Volatility $\\sigma\\uparrow$:** more dispersion fattens the upside while the downside is capped at zero (you just don't exercise). Both **Call ↑ and Put ↑.**\n- **Rate $r\\uparrow$:** higher $r$ discounts the strike you'll pay (call) more heavily — good for calls; bad for puts (you receive a discounted $K$). **Call ↑, Put ↓.**\n- **Dividends $D\\uparrow$:** dividends pull the stock price down on the ex-date — bad for calls, good for puts. **Call ↓, Put ↑.**\n- **Time to maturity $\\tau\\uparrow$:** for **American** options more time is never bad (you keep all earlier rights), so both ↑. For **European** options it's **ambiguous** — more time means more volatility value but also delays/dividends can dominate.\n\nThe one entry everyone misremembers: *European* time-to-maturity is the only '?' in the table.",
                keyIdea: "Comparative statics from the payoff: optionality makes both calls and puts rise with volatility; only European time-to-maturity is ambiguous because dividends and discounting can offset the extra volatility value."
              },
              {
                title: "Put-Call Parity",
                difficulty: "medium",
                tags: ["no-arbitrage", "replication"],
                statement: "State put-call parity for European options on a non-dividend-paying stock and prove it. How does it change for dividend-paying stocks, and for American options?",
                hint: "Build two portfolios with identical payoffs at maturity; no-arbitrage forces equal prices today.",
                solution: "**The relation:** for European options (same $K$, same $T$) on a non-dividend stock,\n$$c + Ke^{-r\\tau} = p + S.$$\n\n**Proof by two portfolios with identical payoffs.**\n- Portfolio A: one call + cash $Ke^{-r\\tau}$ (which grows to exactly $K$ at $T$). At maturity it's worth $\\max(S_T - K, 0) + K = \\max(S_T,\\,K)$.\n- Portfolio B: one put + one share. At maturity: $\\max(K - S_T, 0) + S_T = \\max(S_T,\\,K)$.\n\nBoth portfolios pay the *same* amount in every scenario, so by no-arbitrage they must cost the same **today** — giving the parity. (If they didn't, you'd short the dearer and buy the cheaper for a riskless profit.)\n\n**With dividends $D$** (present value of dividends before $T$): the stock 'leaks' $D$, so\n$$c + Ke^{-r\\tau} = p + S - D.$$\n\n**American options:** early exercise breaks the clean equality; parity becomes a pair of inequalities, $S - K \\le C - P \\le S - Ke^{-r\\tau}$ (non-dividend case).",
                keyIdea: "Two portfolios that pay identically at maturity must cost the same today. Put-call parity is the cleanest no-arbitrage relation and a constant interview staple."
              },
              {
                title: "American vs. European Options",
                difficulty: "hard",
                tags: ["early exercise", "no-arbitrage"],
                statement: "An American and a European call on the *same* non-dividend stock should be worth the same — it's never optimal to exercise the American call early. Why?",
                hint: "Compare exercising now (you get the intrinsic value $S-K$) against selling the option, or hold the call + invest $K$ and compare cash flows at maturity.",
                solution: "Claim: on a non-dividend stock you should **never exercise an American call early**, so it's worth exactly the European call. Three ways to see it:\n\n**1) Intrinsic vs. market value.** Exercising early hands you only the *intrinsic* value $S - K$. But a live call is always worth *at least* $S - Ke^{-r\\tau} > S - K$ (since $Ke^{-r\\tau} < K$), plus extra time value. So you'd always do better **selling** the option than exercising it.\n\n**2) Hold-and-invest strategy.** Instead of exercising at time $t$, keep the call and invest $K$ at rate $r$. At maturity you have an outcome that **dominates** exercising early in every scenario (you earned interest on $K$ and kept the downside protection if the stock fell below $K$). Dominance ⇒ never exercise early.\n\n**3) Parity decomposition.** From European parity, $c = (S - K) + (K - Ke^{-r\\tau}) + p$ — the call equals intrinsic value **plus** the interest saved on the strike **plus** the put's downside insurance. The last two terms are positive, so a live call beats its intrinsic value; throwing them away by exercising is strictly worse.\n\n(For *puts*, or calls on *dividend-paying* stocks, early exercise **can** be optimal — those terms can flip.)",
                keyIdea: "Exercising early throws away time value and the interest earned on the unpaid strike. Without dividends, holding always dominates, so American call = European call."
              },
              {
                title: "Black-Scholes-Merton Differential Equation",
                difficulty: "hard",
                tags: ["Black-Scholes", "Ito's lemma", "hedging"],
                statement: "Write down the Black-Scholes-Merton PDE and sketch its derivation.",
                hint: "Build a portfolio of the derivative hedged by $\\partial V/\\partial S$ shares; the randomness cancels, so the portfolio must earn the risk-free rate.",
                solution: "**The PDE.** For a derivative $V(S,t)$ on a stock following $dS = \\mu S\\,dt + \\sigma S\\,dW$:\n$$\\frac{\\partial V}{\\partial t} + rS\\frac{\\partial V}{\\partial S} + \\tfrac12 \\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} = rV.$$\n\n**Derivation in three moves:**\n1. **Itô's lemma** on $V(S,t)$ gives\n$$dV = \\Big(\\tfrac{\\partial V}{\\partial t} + \\mu S\\tfrac{\\partial V}{\\partial S} + \\tfrac12\\sigma^2 S^2\\tfrac{\\partial^2 V}{\\partial S^2}\\Big)dt + \\sigma S\\tfrac{\\partial V}{\\partial S}\\,dW.$$\n2. **Hedge away the randomness.** Form the portfolio $\\Pi = V - \\tfrac{\\partial V}{\\partial S}S$ (long the derivative, short $\\tfrac{\\partial V}{\\partial S}$ shares). The $dW$ terms in $dV$ and in $\\tfrac{\\partial V}{\\partial S}dS$ **exactly cancel**, leaving $d\\Pi$ with no random term — the portfolio is instantaneously **riskless**.\n3. **No-arbitrage.** A riskless portfolio must earn the risk-free rate: $d\\Pi = r\\Pi\\,dt$. Substituting $\\Pi$ and matching terms gives the PDE.\n\nNotice $\\mu$ (the stock's real drift) **vanished** — option prices don't depend on expected return, only on $r$ and $\\sigma$. That's the seed of *risk-neutral pricing*.",
                keyIdea: "Delta-hedging cancels the Brownian term, making the portfolio riskless; forcing it to earn $r$ gives the PDE. The real-world drift $\\mu$ drops out entirely."
              },
              {
                title: "Black-Scholes Formula",
                difficulty: "hard",
                tags: ["Black-Scholes", "risk-neutral pricing"],
                statement: "State the Black-Scholes formula for a European call and put (with continuous dividend yield), its assumptions, and the intuition behind the two terms.",
                hint: "The call price is (discounted expected stock if exercised) − (discounted strike × probability of exercise), under the risk-neutral measure.",
                solution: "**Formula** (continuous dividend yield $q$):\n$$c = Se^{-q\\tau}N(d_1) - Ke^{-r\\tau}N(d_2), \\qquad p = Ke^{-r\\tau}N(-d_2) - Se^{-q\\tau}N(-d_1),$$\n$$d_1 = \\frac{\\ln(S/K) + (r - q + \\tfrac12\\sigma^2)\\tau}{\\sigma\\sqrt\\tau}, \\qquad d_2 = d_1 - \\sigma\\sqrt\\tau.$$\n\n**Reading the call.** Two pieces: $Ke^{-r\\tau}N(d_2)$ is the discounted strike you pay, weighted by $N(d_2)$ = the **risk-neutral probability the option finishes in the money**; $Se^{-q\\tau}N(d_1)$ is the discounted expected stock value you receive *given* exercise. So $c$ = (expected value received) − (expected cost paid), discounted.\n\n**Assumptions** (worth knowing because each is a way the model fails in practice):\n1. no dividends (or a known continuous yield),\n2. constant risk-free rate,\n3. stock follows geometric Brownian motion with **constant** volatility $\\sigma$,\n4. no transaction costs or taxes; short-selling allowed,\n5. continuous trading,\n6. no arbitrage.\n\nReal markets violate constant-vol most visibly — hence the *volatility smile*.",
                keyIdea: "The call = discounted expected payoff under the risk-neutral measure; $N(d_2)$ is the probability of finishing in the money, $N(d_1)$ the (delta-weighted) expected stock received. Constant volatility is the assumption that breaks first."
              }
            ]
          },
          {
            id: "6.2",
            title: "The Greeks",
            note: "Greeks are sensitivities of the option price: $\\Delta = \\partial V/\\partial S$, $\\Gamma = \\partial^2 V/\\partial S^2$, $\\Theta = \\partial V/\\partial t$, Vega $= \\partial V/\\partial\\sigma$, $\\rho = \\partial V/\\partial r$.",
            problems: [
              {
                title: "Delta",
                difficulty: "medium",
                tags: ["Greeks", "delta", "hedging"],
                statement: "What is the delta of a European call (non-dividend stock)? Why is it clean even though $N(d_1)$ and $N(d_2)$ both depend on $S$? What's the delta of an at-the-money call?",
                hint: "Differentiate $c = SN(d_1) - Ke^{-r\\tau}N(d_2)$ carefully — the extra terms from $\\partial N(d_1)/\\partial S$ and $\\partial N(d_2)/\\partial S$ cancel.",
                solution: "**Result:** $\\Delta = \\dfrac{\\partial c}{\\partial S} = N(d_1)$.\n\n**Why it's clean.** Naively differentiating $c = SN(d_1) - Ke^{-r\\tau}N(d_2)$ you'd worry about the chain-rule terms, since *both* $d_1$ and $d_2$ depend on $S$:\n$$\\frac{\\partial c}{\\partial S} = N(d_1) + S\\,N'(d_1)\\frac{\\partial d_1}{\\partial S} - Ke^{-r\\tau}N'(d_2)\\frac{\\partial d_2}{\\partial S}.$$\nBut a small miracle: $S\\,N'(d_1) = Ke^{-r\\tau}N'(d_2)$ (it follows from the definitions of $d_1, d_2$), and since $\\partial d_1/\\partial S = \\partial d_2/\\partial S$, the **last two terms cancel exactly**, leaving just $N(d_1)$.\n\n**At-the-money.** When $S = K$, $d_1 = \\tfrac{(r + \\sigma^2/2)\\tau}{\\sigma\\sqrt\\tau} > 0$, so $\\Delta = N(d_1) > 0.5$ — a hair above one-half. As $S \\gg K$, $\\Delta \\to 1$ (deep ITM call moves one-for-one with the stock); as $S \\ll K$, $\\Delta \\to 0$.",
                keyIdea: "Delta = $N(d_1)$, the hedge ratio: how many shares to hold to neutralize a small move. The chain-rule terms cancel via $SN'(d_1)=Ke^{-r\\tau}N'(d_2)$; ATM delta is just over 0.5."
              },
              {
                title: "Gamma",
                difficulty: "medium",
                tags: ["Greeks", "gamma", "convexity"],
                statement: "What is gamma, what does it measure, and when is it largest?",
                hint: "Gamma is the rate of change of delta. Think about where a delta-hedge needs the most frequent rebalancing.",
                solution: "**Definition:** $\\Gamma = \\dfrac{\\partial^2 V}{\\partial S^2} = \\dfrac{\\partial \\Delta}{\\partial S}$ — how fast delta itself changes as the stock moves. It's the option's **convexity**.\n\n**Why it matters:** a delta-hedge is only instantaneously correct; gamma tells you how quickly that hedge goes stale. High gamma ⇒ delta swings fast ⇒ you must **rebalance often** (and that constant rebalancing is exactly what you pay for via theta — see Theta).\n\n**Where it peaks:** gamma is largest for **at-the-money options near expiration**. There, the payoff kink at $S = K$ is sharply 'rounded' by only a tiny bit of remaining time value, so delta flips from near 0 to near 1 over a small price range — a very high second derivative. Deep ITM or OTM options have delta pinned near 1 or 0, so gamma ≈ 0.\n\nGamma is the same for a call and a put of identical strike/maturity (from put-call parity, since the stock and bond are linear in $S$).",
                keyIdea: "Gamma = curvature = rate of change of delta. It's biggest for ATM options near expiry, exactly where delta-hedging is hardest and rebalancing is most frequent."
              },
              {
                title: "Theta",
                difficulty: "medium",
                tags: ["Greeks", "theta", "time decay"],
                statement: "What is theta, and what is its relationship to gamma for a delta-hedged position?",
                hint: "Theta is the option's time decay. For a delta-neutral book, theta and gamma trade off through the Black-Scholes PDE.",
                solution: "**Definition:** $\\Theta = \\dfrac{\\partial V}{\\partial t}$ — how the option's value changes as time passes (with everything else fixed). For a long option, $\\Theta$ is usually **negative**: all else equal, an option loses value as expiration approaches (time decay), because there's less time for favorable moves.\n\n**The deep link to gamma.** Take a **delta-hedged** position ($\\Delta = 0$). The Black-Scholes PDE then collapses to\n$$\\Theta + \\tfrac12\\sigma^2 S^2\\,\\Gamma = rV.$$\nSo **theta and gamma have opposite signs** (up to the small $rV$ term): a long-option book has positive gamma (good — you profit from big moves in either direction) but pays for it with negative theta (you bleed value each day the stock sits still). That trade-off *is* the economics of options — you're betting realized volatility will exceed the time decay you're paying.",
                keyIdea: "Theta = time decay (usually negative for longs). Via the BS PDE, a delta-hedged book trades positive gamma against negative theta — you pay daily decay to own convexity."
              },
              {
                title: "Vega",
                difficulty: "medium",
                tags: ["Greeks", "vega", "volatility"],
                statement: "What is vega, and where is it largest? Why is it not a 'true' Greek of the Black-Scholes model?",
                hint: "Vega is sensitivity to volatility — but Black-Scholes assumes volatility is constant.",
                solution: "**Definition:** Vega $= \\dfrac{\\partial V}{\\partial\\sigma}$ — how much the price moves per unit change in volatility. It's **positive** for both calls and puts (more vol ⇒ more optionality value), and is the same for a call and put of matching strike/maturity.\n\n**Where it peaks:** vega is largest for **at-the-money options with long maturity**. ATM-and-far-dated options have the most 'uncertainty to be resolved,' so their value is the most sensitive to how volatile the stock is. Deep ITM/OTM or near-expiry options have little vega.\n\n**The subtlety:** Black-Scholes *assumes* $\\sigma$ is **constant**, so strictly speaking the model has no business having a sensitivity to it — vega measures sensitivity to a parameter the model treats as fixed. That internal inconsistency is why real-world volatility (the *smile*) can't be captured by a single $\\sigma$, and why traders quote prices in *implied* vol and manage vega despite it being 'outside' the model.",
                keyIdea: "Vega = sensitivity to volatility, biggest for long-dated ATM options. It's a sensitivity to a parameter Black-Scholes assumes constant — the tension behind the volatility smile."
              }
            ]
          },
          {
            id: "6.3",
            title: "Option Portfolios & Exotic Options",
            note: "Combine vanilla options into spreads and straddles to express views; price exotics (binary, exchange) with the same risk-neutral / no-arbitrage tools.",
            problems: [
              {
                title: "Bull Spread",
                difficulty: "medium",
                tags: ["option portfolios", "spreads"],
                statement: "What is a bull call spread, what view does it express, and what are the price bounds on it?",
                hint: "It's long a low-strike call and short a high-strike call. Sketch the payoff between the two strikes.",
                solution: "**Construction:** **long a call at strike $K_1$** and **short a call at strike $K_2$**, with $K_1 < K_2$ (same maturity). Net you pay a premium upfront ($c_1 > c_2$, so initial cash flow is negative).\n\n**Payoff at maturity** (rises with the stock, then caps out):\n- $S_T \\le K_1$: both calls expire worthless → payoff 0.\n- $K_1 < S_T < K_2$: payoff $S_T - K_1$ (the long call is in the money).\n- $S_T \\ge K_2$: payoff $K_2 - K_1$ (both in the money; capped).\n\n**View:** moderately **bullish** — you profit if the stock rises, but you cap your upside at $K_2$ in exchange for a cheaper position than an outright call (the short call subsidizes it).\n\n**Price bounds:** the spread's value is bounded by the discounted max payoff, $0 \\le c_1 - c_2 \\le e^{-r\\tau}(K_2 - K_1)$, and the payoff itself never exceeds $\\frac{K_2-K_1}{K_2}S$ — useful sanity checks.",
                keyIdea: "Long low-strike + short high-strike call: a capped bullish bet that's cheaper than a naked call. Payoff ramps from 0 to $K_2-K_1$ between the strikes."
              },
              {
                title: "Straddle",
                difficulty: "medium",
                tags: ["option portfolios", "volatility"],
                statement: "What is a straddle and when would you buy one?",
                hint: "Long a call and a put at the same strike and maturity. Think about what payoff profile that creates.",
                solution: "**Construction:** **long a call AND a put** at the **same strike $K$ and maturity $T$**. The payoff is $|S_T - K|$ — a 'V' shape that pays off when the stock makes a **big move in *either* direction**, and loses (the premiums) if the stock stays near $K$.\n\n**When to buy:** a straddle is fundamentally a **bet on volatility**, not direction. You buy it when you expect the stock to move sharply but don't know which way — e.g. ahead of earnings, an FDA decision, or a binary news event. More precisely, you profit if **realized** volatility ends up exceeding the **implied** volatility baked into the option prices you paid. If you think the market is *underpricing* future vol, buy the straddle; if overpricing, sell it.\n\nAt initiation an ATM straddle is roughly delta-neutral (call delta ≈ +0.5, put delta ≈ −0.5), so it's nearly a pure volatility play at the outset.",
                keyIdea: "Straddle = long call + long put at the same strike: a direction-agnostic bet that realized volatility beats the implied vol you paid for."
              },
              {
                title: "Binary Options",
                difficulty: "hard",
                tags: ["exotic options", "binary", "hedging"],
                statement: "Price a cash-or-nothing (digital) European call on a non-dividend stock (GBM), and explain why it's so hard to hedge near maturity.",
                hint: "A cash-or-nothing call pays \\$1 if $S_T > K$. Its price is the discounted risk-neutral probability of finishing in the money.",
                solution: "**Pricing.** A cash-or-nothing call pays exactly **\\$1 if $S_T > K$** and \\$0 otherwise. Its value is the discounted *probability* of that event under the risk-neutral measure — and we already know that probability is $N(d_2)$ (the same $d_2$ from Black-Scholes). So\n$$c_{\\text{binary}} = e^{-r\\tau}N(d_2).$$\n\n**Why it's a hedging nightmare near maturity.** Its delta is\n$$\\Delta = \\frac{\\partial c_{\\text{binary}}}{\\partial S} = e^{-r\\tau}N'(d_2)\\frac{1}{S\\sigma\\sqrt\\tau}.$$\nAs $\\tau \\to 0$ with $S$ near $K$, that $\\frac{1}{\\sqrt\\tau}$ blows up — **gamma explodes**. The payoff is a *cliff* at $K$: a penny of stock movement flips the payout between \\$0 and \\$1, so the delta hedge would need to swing between huge long and short share positions almost instantly. In practice this is un-hedgeable with the stock alone; traders instead **approximate the digital with a tight bull spread** (long a call at $K - \\varepsilon$, short at $K + \\varepsilon$, scaled by $\\frac{1}{2\\varepsilon}$), turning the cliff into a steep-but-finite ramp.",
                keyIdea: "Binary call = $e^{-r\\tau}N(d_2)$ (discounted prob of finishing ITM). The payoff cliff at $K$ makes gamma explode near expiry, so it's hedged with a narrow bull spread, not the stock."
              },
              {
                title: "Exchange Options",
                difficulty: "hard",
                tags: ["exotic options", "change of numeraire"],
                statement: "Price an exchange option paying $\\max(S_{1,T} - S_{2,T}, 0)$ at maturity, where $S_1, S_2$ are non-dividend GBM stocks with correlation $\\rho$.",
                hint: "Use a change of numeraire: measure everything in units of stock 2 instead of dollars. The two-asset problem collapses to one.",
                solution: "**The trick — change of numeraire.** Normally we price in dollars. But you can measure value in units of *another asset* as long as it's always positive. Here, use **$S_2$ as the numeraire**: divide the payoff by $S_{2,T}$,\n$$\\frac{\\max(S_{1,T} - S_{2,T}, 0)}{S_{2,T}} = \\max\\!\\Big(\\frac{S_{1,T}}{S_{2,T}} - 1,\\, 0\\Big).$$\nIn these units the payoff is just a **standard call with strike 1** on the single ratio $X = S_1/S_2$. Two correlated Brownian motions collapse into one.\n\n**Result (Margrabe's formula).** The ratio $X$ is itself lognormal with volatility\n$$\\hat\\sigma = \\sqrt{\\sigma_1^2 - 2\\rho\\sigma_1\\sigma_2 + \\sigma_2^2},$$\nso applying Black-Scholes (strike 1, no drift in the numeraire, zero rate) gives\n$$V = S_1 N(d_1) - S_2 N(d_2), \\quad d_1 = \\frac{\\ln(S_1/S_2) + \\tfrac12\\hat\\sigma^2\\tau}{\\hat\\sigma\\sqrt\\tau}, \\quad d_2 = d_1 - \\hat\\sigma\\sqrt\\tau.$$\nNote correlation enters only through $\\hat\\sigma$: more correlated assets move together, shrinking $\\hat\\sigma$ and the option's value.",
                keyIdea: "Switch the numeraire to stock 2, turning a two-asset payoff into a one-asset call on the price ratio. Margrabe's formula uses the combined volatility $\\sqrt{\\sigma_1^2 - 2\\rho\\sigma_1\\sigma_2 + \\sigma_2^2}$."
              }
            ]
          },
          {
            id: "6.4",
            title: "Other Finance Questions",
            note: "Position-specific knowledge: portfolio theory, risk measures (VaR), fixed-income (duration/convexity, rate models), and forwards vs. futures.",
            problems: [
              {
                title: "Portfolio Optimization",
                difficulty: "medium",
                tags: ["Markowitz", "mean-variance", "diversification"],
                statement: "Two stocks A and B both have expected return 12%; A's return has std 20%, B's 30%, correlation 50%. How do you allocate to minimize the variance of the portfolio, and what's the lesson?",
                hint: "Write the portfolio variance as a function of the weight $w$ in A; minimize. Diversification helps because correlation < 1.",
                solution: "Since both stocks have the **same expected return** (12%), every allocation has the same expected return — so 'best' just means **minimum variance**. Put weight $w$ in A and $1-w$ in B:\n$$\\sigma_p^2 = w^2\\sigma_A^2 + (1-w)^2\\sigma_B^2 + 2w(1-w)\\rho\\sigma_A\\sigma_B.$$\nWith $\\sigma_A = 0.2$, $\\sigma_B = 0.3$, $\\rho = 0.5$, take $\\frac{d\\sigma_p^2}{dw} = 0$. The minimum-variance weight is\n$$w^* = \\frac{\\sigma_B^2 - \\rho\\sigma_A\\sigma_B}{\\sigma_A^2 + \\sigma_B^2 - 2\\rho\\sigma_A\\sigma_B} = \\frac{0.09 - 0.03}{0.04 + 0.09 - 0.06} = \\frac{0.06}{0.07} \\approx 86\\%\\text{ in A}.$$\n\n**The lesson (Markowitz):** because the correlation is below 1, the blended portfolio has **lower** volatility than *either* stock alone — diversification is a 'free lunch' in risk. (In matrix form for $N$ assets, you minimize $w^\\top \\Sigma w$ subject to a target return — the mean-variance frontier.)",
                keyIdea: "With equal expected returns, optimize purely on variance. Correlation < 1 lets a mix beat both stand-alone stocks — the core of Markowitz diversification."
              },
              {
                title: "Value at Risk",
                difficulty: "medium",
                tags: ["risk", "VaR", "tail risk"],
                statement: "What is Value at Risk (VaR), and what are its main shortcomings?",
                hint: "VaR is a percentile of the loss distribution. Think about what it ignores beyond that percentile, and whether it rewards diversification.",
                solution: "**Definition:** VaR at confidence $1-\\alpha$ over a horizon is the loss level you won't exceed with probability $1-\\alpha$ — formally the (negative) $\\alpha$-percentile of the profit/loss distribution. *E.g.* a 1-day 95% VaR of \\$1M means: on 95% of days losses stay under \\$1M.\n\n**Shortcomings:**\n1. **It ignores the tail beyond the percentile.** VaR says nothing about *how bad* the worst $\\alpha$% losses are — two portfolios with the same VaR can have wildly different catastrophic tails. (This is why **Conditional VaR / Expected Shortfall** — the average loss beyond VaR — is preferred.)\n2. **It's not sub-additive** (not 'coherent'). Diversification should never *increase* risk, yet you can construct portfolios where $\\text{VaR}(A+B) > \\text{VaR}(A) + \\text{VaR}(B)$ — e.g. combining positions whose losses are individually rare but jointly concentrated (like selling separate credit-default protection). A risk measure that can penalize diversification is theoretically broken.\n3. **It's percentile-based**, so for fat-tailed or derivative-heavy books it can badly understate true risk.\n\nA 'coherent' risk measure must be monotone, sub-additive, positively homogeneous, and translation-invariant; VaR fails sub-additivity, Expected Shortfall doesn't.",
                keyIdea: "VaR = a loss percentile. Its two big flaws: it's blind to the size of tail losses beyond it, and it isn't sub-additive (can punish diversification) — so it's not a coherent risk measure. Expected Shortfall fixes both."
              },
              {
                title: "Duration and Convexity",
                difficulty: "medium",
                tags: ["fixed income", "duration", "convexity"],
                statement: "Define duration and convexity of a bond and explain how they approximate the price change for a yield move.",
                hint: "They're the first- and second-order sensitivities of price to yield — a Taylor expansion of $P(y)$.",
                solution: "Think of bond price $P$ as a function of yield $y$ and Taylor-expand around the current yield:\n$$\\frac{\\Delta P}{P} \\approx -D\\,\\Delta y + \\tfrac12 C\\,(\\Delta y)^2.$$\n\n- **Duration** $D = -\\dfrac{1}{P}\\dfrac{dP}{dy}$ — the **first-order** sensitivity. It's (roughly) the weighted-average time to receive the bond's cash flows, and it tells you the *percentage* price drop per unit rise in yield. Longer-maturity / lower-coupon bonds have higher duration (more rate-sensitive).\n- **Convexity** $C = \\dfrac{1}{P}\\dfrac{d^2P}{dy^2}$ — the **second-order** correction. The price–yield curve bends (it's convex), so duration alone *overstates* the loss when yields rise and *understates* the gain when yields fall. Convexity captures that curvature.\n\n**Using them:** for small $\\Delta y$, duration alone ($\\Delta P/P \\approx -D\\,\\Delta y$) is a good linear estimate; for larger moves, add the convexity term for accuracy. Convexity is *desirable* to a bondholder — it means you lose a little less and gain a little more than duration predicts.",
                keyIdea: "Duration = first-order (linear) price sensitivity to yield; convexity = second-order curvature correction. Together they're a Taylor expansion of the price–yield curve; positive convexity helps the holder."
              },
              {
                title: "Forward and Futures",
                difficulty: "medium",
                tags: ["forwards", "futures", "mark-to-market"],
                statement: "What's the difference between a futures and a forward contract, and when do their prices differ?",
                hint: "Both lock a price for future delivery, but futures are marked-to-market daily. When does that daily settlement matter?",
                solution: "**Same idea, different plumbing.** Both lock in a price today for delivery later. Differences:\n- **Forwards** are OTC, customizable, and settle **once at maturity** (a single cash flow at the end).\n- **Futures** are exchange-traded, standardized, and **marked-to-market daily** — gains/losses settle into your margin account every day.\n\n**When do prices differ?** If interest rates are **deterministic**, futures and forwards have the **same** theoretical price, $F = Se^{(r + u - y)\\tau}$ (with storage cost $u$, yield $y$). The gap appears only when **rates are stochastic and correlated with the underlying**:\n- If the futures price is **positively correlated** with rates: gains tend to land when rates are high (so you reinvest them at a high rate) and losses when rates are low (cheap to finance). That daily-settlement timing benefit makes the **futures price slightly higher** than the forward.\n- Negative correlation reverses it, making the forward worth more.\n\nSo the mark-to-market feature is only valuable (or costly) to the extent settlement timing correlates with financing rates.",
                keyIdea: "Forwards settle once at maturity; futures settle daily. Identical prices under deterministic rates — they diverge only when rates are stochastic and correlated with the underlying, via the reinvestment timing of daily settlement."
              },
              {
                title: "Interest Rate Models",
                difficulty: "hard",
                tags: ["interest rates", "term structure"],
                statement: "Describe the main families of interest-rate models and how they differ.",
                hint: "Split by what they model (the short rate vs. the whole curve) and by whether they fit today's curve exactly (arbitrage-free vs. equilibrium).",
                solution: "Two cross-cutting classifications:\n\n**(1) What do they model?**\n- **Short-rate models** describe the instantaneous rate $r(t)$ as a stochastic process — e.g. **Vasicek**, **Cox-Ingersoll-Ross (CIR)**, **Ho-Lee**, **Hull-White**. Simple and tractable.\n- **Forward-rate (curve) models** describe the dynamics of the *entire* yield curve — e.g. **Heath-Jarrow-Morton (HJM)**. Richer but heavier.\n\n**(2) Do they fit today's market?**\n- **Equilibrium models** derive rates from economic assumptions and need **not** match the current term structure (Vasicek, CIR).\n- **Arbitrage-free models** take today's observed curve as input and reproduce it exactly (Ho-Lee, Hull-White) — essential for consistent derivative pricing.\n\n**Two key short-rate examples:**\n- **Vasicek:** $dr = a(b - r)\\,dt + \\sigma\\,dW$ — **mean-reverting** to long-run level $b$ (a desirable feature), but with constant $\\sigma$ it allows **negative rates** (historically seen as a flaw).\n- **CIR:** $dr = a(b - r)\\,dt + \\sigma\\sqrt{r}\\,dW$ — the $\\sqrt{r}$ term shrinks volatility as rates approach zero, keeping rates **non-negative** while preserving mean reversion.",
                keyIdea: "Classify by scope (short-rate vs. whole-curve) and by calibration (equilibrium vs. arbitrage-free). Vasicek mean-reverts but allows negative rates; CIR's $\\sqrt{r}$ diffusion keeps rates positive."
              }
            ]
          }
        ]
      },
      {
        num: 7,
        title: "Algorithms & Numerical Methods",
        blurb: "Classic algorithms, bit tricks (the power of two), and numerical methods like Monte Carlo and finite differences.",
        topics: [
          {
            id: "7.1",
            title: "Algorithms",
            note: "Think in terms of asymptotic cost $T(n)$ as $n\\to\\infty$ (big-O). The recurring tricks: clever invariants, divide-and-conquer, and one-pass scans that maintain a running quantity.",
            problems: [
              {
                title: "Number Swap",
                difficulty: "easy",
                tags: ["bit manipulation", "in-place"],
                statement: "Swap two integers $i$ and $j$ **without** using a temporary variable.",
                hint: "Either use arithmetic (sum then subtract), or XOR three times.",
                solution: "**Arithmetic version** — stash the sum in one slot, then peel it apart:\n```\ni = i + j;   // i now holds the sum\nj = i - j;   // j becomes the old i\ni = i - j;   // i becomes the old j\n```\n(Caveat: the intermediate sum can **overflow** for large ints.)\n\n**XOR version** — overflow-safe, using $x \\oplus x = 0$ and $x \\oplus 0 = x$:\n```\ni = i ^ j;\nj = i ^ j;   // = (i^j)^j = original i\ni = i ^ j;   // = (i^j)^(original i) = original j\n```\nEach line folds one value into the other and back out, so no temp slot is needed. (Don't apply XOR-swap to the *same* memory location — it would zero it out.)",
                keyIdea: "Use an invertible operation (add/subtract or XOR) to encode both values in one slot, then decode. XOR avoids the overflow risk of the arithmetic trick."
              },
              {
                title: "Unique Elements",
                difficulty: "easy",
                tags: ["arrays", "one pass"],
                statement: "Given a **sorted** array, extract the distinct values in one pass.",
                hint: "In a sorted array, an element is new exactly when it differs from the previous one.",
                solution: "Sorting buys you a one-pass solution: equal values are adjacent, so an element is **new** precisely when it differs from the one before it. Walk through once, copying an element to the output only when $a_k \\ne a_{k-1}$:\n```\nresult = [a[0]];\nfor (k = 1; k < n; ++k)\n    if (a[k] != a[k-1]) result.push(a[k]);\n```\nThis is $O(n)$ time and (if done in-place) $O(1)$ extra space. If the array weren't sorted you'd either sort first ($O(n\\log n)$) or use a hash set ($O(n)$ time, $O(n)$ space).",
                keyIdea: "On sorted data, 'distinct' becomes 'differs from neighbor' — a single $O(n)$ scan with no extra structure."
              },
              {
                title: "Horner's Algorithm",
                difficulty: "easy",
                tags: ["polynomials", "efficiency"],
                statement: "Evaluate a polynomial $a_n x^n + a_{n-1}x^{n-1} + \\cdots + a_1 x + a_0$ efficiently. How many multiplications?",
                hint: "Factor out $x$ repeatedly from the inside out.",
                solution: "Computing each power $x^k$ separately wastes multiplications. **Horner's method** rewrites the polynomial by repeatedly factoring out $x$:\n$$a_0 + x\\big(a_1 + x\\big(a_2 + \\cdots + x(a_{n-1} + x\\,a_n)\\big)\\big).$$\nEvaluate from the innermost parenthesis outward:\n```\nresult = a[n];\nfor (k = n-1; k >= 0; --k)\n    result = result * x + a[k];\n```\nThis uses only **$n$ multiplications and $n$ additions** — optimal, versus the naive $O(n^2)$ multiplications from recomputing powers.",
                keyIdea: "Nested factoring ($a_0 + x(a_1 + x(\\cdots))$) evaluates an $n$-degree polynomial in just $n$ multiply-adds."
              },
              {
                title: "Moving Average",
                difficulty: "easy",
                tags: ["arrays", "sliding window"],
                statement: "Compute the moving average of a stream over a window of size $w$ efficiently (don't re-sum the whole window each step).",
                hint: "When the window slides, only one element enters and one leaves.",
                solution: "Keep a **running sum** of the current window. Each time the window slides by one, you don't re-add $w$ numbers — you just **add the entering element and subtract the leaving one**:\n```\nsum += x[i] - x[i-w];   // i >= w\naverage = sum / w;\n```\nThat's $O(1)$ work per step and $O(n)$ overall, versus the naive $O(nw)$ of summing the window from scratch each time. (Numerically, for very long streams, occasionally recompute the sum to avoid floating-point drift.)",
                keyIdea: "Maintain a running window sum; a slide is one addition and one subtraction — $O(1)$ per step instead of $O(w)$."
              },
              {
                title: "Sorting Algorithm",
                difficulty: "medium",
                tags: ["sorting", "complexity"],
                statement: "Compare the common sorting algorithms — which to use when, and what are their time/space costs?",
                hint: "Comparison sorts can't beat $O(n\\log n)$ in the worst case. Think about stability and memory too.",
                solution: "Key facts to have ready:\n\n- **Quicksort** — average $O(n\\log n)$, worst case $O(n^2)$ (bad pivots), in-place ($O(\\log n)$ stack). Fastest in practice; the usual default.\n- **Merge sort** — $O(n\\log n)$ *guaranteed*, **stable**, but needs $O(n)$ extra space. Good when worst-case guarantees or stability matter, or for linked lists / external sorting.\n- **Heap sort** — $O(n\\log n)$ guaranteed, in-place, but not stable and poor cache behavior.\n- **Insertion sort** — $O(n^2)$, but excellent on **small or nearly-sorted** inputs (hence used as the base case inside quicksort).\n\n**Lower bound:** any *comparison-based* sort needs $\\Omega(n\\log n)$ comparisons in the worst case (there are $n!$ orderings, and each comparison gives one bit, so you need $\\log_2(n!) \\approx n\\log n$). You can beat it only with non-comparison sorts (counting/radix sort) when keys are small integers.",
                keyIdea: "Quicksort for speed, merge sort for guarantees/stability. Comparison sorts are bounded below by $\\Omega(n\\log n)$; only radix/counting sort escapes it for bounded integer keys."
              },
              {
                title: "Random Permutation",
                difficulty: "medium",
                tags: ["randomization", "shuffling"],
                statement: "Generate a **uniformly random** permutation of an $n$-element array (every ordering equally likely).",
                hint: "Go from the end: swap each position with a random earlier-or-equal position.",
                solution: "Use the **Fisher–Yates shuffle**. Walk from the last index down to the first; at position $i$, pick a random index $j$ in $[0, i]$ and swap:\n```\nfor (i = n-1; i > 0; --i) {\n    j = random integer in [0, i];\n    swap(a[i], a[j]);\n}\n```\nThis is $O(n)$ and **provably uniform**: position $i$ receives any of its $i+1$ candidates with equal probability, so the total number of equally likely outcomes is $n\\cdot(n-1)\\cdots 1 = n!$ — exactly the number of permutations.\n\n**Common bug to avoid:** drawing $j$ from the *full* range $[0, n-1]$ each time does **not** give a uniform distribution (it produces $n^n$ equally likely runs, which isn't divisible by $n!$).",
                keyIdea: "Fisher–Yates: swap each element with a uniformly chosen earlier element. $O(n)$ and exactly uniform — but the random index must be drawn from the shrinking range, not the whole array."
              },
              {
                title: "Search Algorithm",
                difficulty: "easy",
                tags: ["binary search", "divide and conquer"],
                statement: "Find a target value in a **sorted** array efficiently.",
                hint: "Halve the search range each comparison.",
                solution: "**Binary search.** Keep a candidate range $[lo, hi]$; compare the target to the middle element and discard half the range each step:\n```\nlo = 0; hi = n-1;\nwhile (lo <= hi) {\n    mid = lo + (hi - lo) / 2;      // avoids overflow vs (lo+hi)/2\n    if (a[mid] == target) return mid;\n    else if (a[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n}\nreturn NOT_FOUND;\n```\nEach step halves the candidates, so it runs in **$O(\\log n)$**. Two classic pitfalls: compute `mid` as `lo + (hi-lo)/2` to avoid integer overflow, and be careful with the loop boundary (`<=` vs `<`) to not miss the last element.",
                keyIdea: "Binary search halves the range per comparison → $O(\\log n)$. Watch the midpoint-overflow and off-by-one boundary bugs."
              },
              {
                title: "Fibonacci Numbers",
                difficulty: "medium",
                tags: ["recursion", "dynamic programming"],
                statement: "Compute the $n$-th Fibonacci number efficiently. Why is naive recursion bad?",
                hint: "Naive recursion recomputes the same subproblems exponentially many times.",
                solution: "**Why naive recursion is terrible:** `fib(n) = fib(n-1) + fib(n-2)` recomputes the same values over and over — the call tree has $\\approx \\phi^n$ nodes, so it's **exponential** $O(\\phi^n)$.\n\n**Fix 1 — bottom-up iteration** ($O(n)$ time, $O(1)$ space): keep just the last two values.\n```\na = 0; b = 1;\nfor (k = 2; k <= n; ++k) { c = a + b; a = b; b = c; }\nreturn b;\n```\n\n**Fix 2 — matrix exponentiation** ($O(\\log n)$): since $\\begin{pmatrix}F_{n+1}\\\\F_n\\end{pmatrix} = \\begin{pmatrix}1&1\\\\1&0\\end{pmatrix}^{n}\\begin{pmatrix}1\\\\0\\end{pmatrix}$, raise the matrix by fast exponentiation (repeated squaring).\n\n**Fix 3 — closed form** (Binet): $F_n = \\frac{\\phi^n - \\psi^n}{\\sqrt5}$ with $\\phi = \\frac{1+\\sqrt5}{2}$ — $O(1)$ but suffers floating-point error for large $n$.",
                keyIdea: "Naive recursion is exponential because it recomputes subproblems. Memoize / iterate for $O(n)$, or use matrix power for $O(\\log n)$."
              },
              {
                title: "Maximum Contiguous Subarray",
                difficulty: "medium",
                tags: ["dynamic programming", "one pass"],
                statement: "Given an array of (possibly negative) numbers, find the contiguous subarray with the largest sum.",
                hint: "Scan once, tracking the best sum that *ends at* the current position.",
                solution: "**Kadane's algorithm**, a one-pass DP. Track `cur` = the largest subarray sum *ending at the current element*. At each element you either **extend** the previous run or **start fresh** at this element — whichever is larger:\n```\ncur = best = a[0];\nfor (i = 1; i < n; ++i) {\n    cur = max(a[i], cur + a[i]);   // extend, or restart here\n    best = max(best, cur);\n}\nreturn best;\n```\nThe insight: if the running sum ever goes negative, it can only *hurt* what follows, so you drop it and restart. This is **$O(n)$** time, $O(1)$ space — far better than the $O(n^2)$ brute force over all subarrays.",
                keyIdea: "Kadane: maintain the best sum ending here; restart whenever the running sum turns negative. One $O(n)$ pass, because a negative prefix can never help the future."
              }
            ]
          },
          {
            id: "7.2",
            title: "The Power of Two",
            note: "Binary thinking: numbers are sums of powers of 2, bit shifts multiply/divide by 2, and AND/XOR let you probe individual bits. Many puzzles reduce to 'encode in binary'.",
            problems: [
              {
                title: "Power of 2?",
                difficulty: "easy",
                tags: ["bit manipulation"],
                statement: "Determine whether a positive integer $x$ is a power of 2, in one operation.",
                hint: "A power of 2 has exactly one bit set. What does subtracting 1 do to that bit pattern?",
                solution: "A power of 2 in binary has **exactly one bit set** (e.g. $8 = 1000_2$). Subtracting 1 flips that bit off and turns all the lower bits on ($8-1 = 0111_2$). So $x$ and $x-1$ share **no** set bits, and\n$$x \\,\\&\\, (x-1) = 0 \\iff x \\text{ is a power of 2}.$$\n```\nbool isPowerOfTwo(x) { return x > 0 && (x & (x-1)) == 0; }\n```\nOne bitwise-AND does it. (For any other number, $x$ has $\\ge 2$ set bits and at least one survives the AND.)",
                keyIdea: "$x \\,\\&\\, (x-1)$ clears the lowest set bit; the result is 0 only when $x$ had a single bit — i.e. a power of 2."
              },
              {
                title: "Multiplication by 7",
                difficulty: "easy",
                tags: ["bit manipulation"],
                statement: "Multiply an integer by 7 without using the multiplication operator.",
                hint: "$7x = 8x - x$, and multiplying by 8 is a left shift.",
                solution: "Shifting left by $k$ bits multiplies by $2^k$, so $8x = x \\ll 3$. Then\n$$7x = 8x - x = (x \\ll 3) - x.$$\n```\nresult = (x << 3) - x;\n```\nOne shift and one subtraction. (Generally, any constant multiplier becomes a few shifts and adds/subtracts based on its binary form — e.g. $x\\times 6 = (x\\ll2)+(x\\ll1)$.)",
                keyIdea: "Express the multiplier via powers of two: $7 = 8 - 1$, so $7x = (x\\ll 3) - x$. Shifts replace multiplication."
              },
              {
                title: "Probability Simulation",
                difficulty: "hard",
                tags: ["randomization", "binary expansion"],
                statement: "Using only a fair coin, design a simple game that you win with a given probability $p$, $0 < p < 1$.",
                hint: "Write $p$ in binary; each fair-coin toss reveals one bit of a uniform random number.",
                solution: "**The idea:** a sequence of fair-coin tosses builds a uniform random number in $(0,1)$ one **binary digit** at a time. Compare it against $p$'s binary expansion.\n\nWrite $p = 0.p_1 p_2 p_3\\cdots$ in binary ($p_i \\in \\{0,1\\}$). Toss the coin, calling heads = 1, tails = 0, to generate bits $s_1, s_2, \\dots$ of your random number. Compare bit by bit:\n- as soon as $s_i < p_i$ → **win** and stop;\n- as soon as $s_i > p_i$ → **lose** and stop;\n- if $s_i = p_i$, toss again for the next bit.\n\nSince your tossed bits form a uniform number in $[0,1)$, you win exactly when that number falls below $p$ — probability **$p$**. The game ends quickly: it terminates with probability $\\tfrac12$ at each step, so the expected number of tosses is just 2 (for finite-binary $p$, it always halts).",
                keyIdea: "Fair-coin tosses generate the binary digits of a uniform $[0,1)$ number; compare against $p$'s binary expansion to win with probability exactly $p$."
              },
              {
                title: "Poisonous Wine",
                difficulty: "hard",
                tags: ["binary encoding", "search"],
                statement: "You have 1000 bottles of wine; exactly one is poisoned. The poison kills a mouse in exactly 18 hours (no earlier symptoms). You have 10 mice and 20 hours before the party. How do you find the poisoned bottle in time?",
                hint: "1000 < 1024 = 2^10. Give each bottle a 10-bit binary ID and assign one mouse per bit.",
                solution: "**Recognize the binary structure:** $1000 < 1024 = 2^{10}$, and you have exactly **10 mice**. Number the bottles $0$–$999$ and write each number in **10-bit binary**. Assign mouse $k$ to **bit $k$**.\n\n**The test:** each mouse drinks from *every* bottle whose ID has a 1 in that mouse's bit position. (One round of sipping, well within the 18-hour deadline.)\n\n**Read the result after 18 hours:** the set of mice that die spells out the binary ID of the poisoned bottle — mouse $k$ dies iff bit $k$ of the poisoned bottle's number is 1. For example, if mice for bits 0, 5, 8 die, the poisoned bottle is $2^0 + 2^5 + 2^8 = 1 + 32 + 256 = 289$.\n\nTen mice give 10 bits = up to 1024 distinguishable bottles, comfortably covering 1000.",
                keyIdea: "Binary encoding: each mouse reports one bit of the poisoned bottle's ID. $n$ mice distinguish $2^n$ bottles in a single simultaneous test."
              }
            ]
          },
          {
            id: "7.3",
            title: "Numerical Methods",
            note: "When closed forms run out, simulate or discretize: **Monte Carlo** averages random payoffs; **finite differences** turn a PDE into a grid you can step through.",
            problems: [
              {
                title: "Monte Carlo Simulation",
                difficulty: "medium",
                tags: ["Monte Carlo", "random number generation"],
                statement: "How do you price a European option by Monte Carlo? And how do you generate $N(\\mu,\\sigma^2)$ samples if you only have a uniform $[0,1]$ generator?",
                hint: "Average discounted payoffs over many simulated terminal prices. For normals, transform uniforms (inverse-CDF or Box–Muller).",
                solution: "**Pricing.** The option price is the discounted **expected** payoff under the risk-neutral measure, so estimate it by averaging over many simulated paths. Simulate $M$ terminal stock prices $S_{T,k}$ (from the risk-neutral GBM, using normal shocks), then\n$$C \\approx e^{-r(T-t)}\\,\\frac{1}{M}\\sum_{k=1}^{M} \\max(S_{T,k} - K,\\,0).$$\nThe error shrinks like $1/\\sqrt{M}$ — slow, but it scales to high dimensions where PDE grids can't.\n\n**Generating normals from uniforms — two standard routes:**\n1. **Inverse transform:** if $U \\sim \\text{Unif}[0,1]$, then $X = F^{-1}(U)$ has CDF $F$. For the normal there's no closed-form $\\Phi^{-1}$, so you use a numerical approximation.\n2. **Box–Muller:** from two independent uniforms $U_1, U_2$, $\\;Z_1 = \\sqrt{-2\\ln U_1}\\cos(2\\pi U_2)$ and $Z_2 = \\sqrt{-2\\ln U_1}\\sin(2\\pi U_2)$ are two independent $N(0,1)$ samples.\n\nFinally scale: $X = \\mu + \\sigma Z$ gives $N(\\mu,\\sigma^2)$.",
                keyIdea: "Monte Carlo = average discounted simulated payoffs (error $\\sim 1/\\sqrt M$). Build normals from uniforms via inverse-CDF or Box–Muller, then shift/scale by $\\mu,\\sigma$."
              },
              {
                title: "Finite Difference Method",
                difficulty: "hard",
                tags: ["finite differences", "PDE"],
                statement: "How does the finite difference method price a derivative, and what's the trade-off between the explicit and implicit schemes?",
                hint: "Discretize the Black-Scholes PDE on a stock-price × time grid; replace derivatives with differences and step backward from the payoff.",
                solution: "**The idea:** the option value solves the Black-Scholes PDE with the payoff as a *terminal* condition. Lay down a grid over stock price $S$ and time $t$, approximate the derivatives by **differences** between neighboring grid points, and march **backward** in time from the known payoff at maturity to today.\n\nReplace each derivative with a difference quotient — e.g. $\\frac{\\partial V}{\\partial S} \\approx \\frac{V_{i+1} - V_{i-1}}{2\\,\\Delta S}$ and $\\frac{\\partial^2 V}{\\partial S^2} \\approx \\frac{V_{i+1} - 2V_i + V_{i-1}}{\\Delta S^2}$ — turning the PDE into a system of algebraic equations linking adjacent time layers.\n\n**Explicit vs. implicit:**\n- **Explicit** — each new value is written directly from known values at the next time layer. Simple, but only **conditionally stable**: the time step must be tiny relative to $\\Delta S^2$, or the solution blows up.\n- **Implicit** (and Crank–Nicolson) — each layer requires solving a linear system (a tridiagonal solve). More work per step, but **unconditionally stable**, so you can take larger time steps. Crank–Nicolson averages the two and gains second-order accuracy in time.\n\nFinite differences naturally handle **American** options too — at each grid node take $\\max(\\text{continuation value},\\ \\text{intrinsic value})$, exactly the early-exercise check.",
                keyIdea: "Discretize the BS PDE on a grid and step backward from the payoff. Explicit is simple but conditionally stable; implicit/Crank–Nicolson cost a linear solve per step but are unconditionally stable."
              }
            ]
          }
        ]
      }
    ]
  };
})();
