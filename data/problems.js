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
                solution: "Work **backwards** from the smallest case.\n\n- **1 pirate (call him P1):** he keeps all 100 coins.\n- **2 pirates (P1, P2):** P2 proposes. His own vote is 50% of the votes, which is enough. So P2 keeps all 100; P1 gets nothing.\n- **3 pirates:** P3 only needs one more vote. P1 knows that if P3's plan fails, we fall back to the 2-pirate case where P1 gets 0. So P3 offers P1 **one coin**, keeps 99, and gets P1's vote.\n- **4 pirates:** P4 needs one more vote. In the 3-pirate fallback, P2 gets nothing — so P4 buys P2 with **one coin**, keeps 99, and the plan passes 2 votes out of 4 (P4 + P2).\n- **5 pirates:** P5 needs two more votes. In the 4-pirate fallback, P1 and P3 each get nothing. So P5 offers **one coin each to P1 and P3**, keeps 98, and passes with 3 of 5 votes.\n\n**Answer:** P5 takes 98, gives 1 coin each to P1 and P3, and 0 to P2 and P4.\n\nThe pattern generalizes: for $2n+1$ pirates (with $n$ small enough), the senior pirate bribes $n$ of the juniors with one coin each — specifically the ones who would get nothing in the next round.",
                keyIdea: "Backward induction: anchor on the trivial base case and let each player reason about what happens if his proposal is rejected. The proposer only needs to bribe the cheapest votes."
              },
              {
                title: "Tiger and Sheep",
                difficulty: "medium",
                tags: ["game theory", "parity", "induction"],
                statement: "One hundred tigers and one sheep are on a magic island with only grass. Tigers can eat grass, but would rather eat the sheep. If a tiger eats the sheep it **becomes** a sheep (and can then be eaten). All tigers are perfectly rational and want to survive. Will the sheep be eaten?",
                hint: "Start with 1 tiger, then 2, then 3. The answer depends only on whether the number of tigers is odd or even.",
                solution: "Reason by induction on the number of tigers.\n\n- **1 tiger:** it eats the sheep — there is no other tiger to eat it afterward. Sheep eaten.\n- **2 tigers:** if a tiger eats the sheep, it becomes a sheep and the other tiger eats it. So neither eats. Sheep safe.\n- **3 tigers:** whichever tiger eats the sheep turns into a sheep, leaving a 2-tiger situation in which (from above) the new sheep is **safe**. So eating is safe — the sheep gets eaten.\n- **4 tigers:** eating the sheep creates a 3-tiger situation where a lone sheep gets eaten. So no tiger dares eat. Sheep safe.\n\n**Pattern:** with an **odd** number of tigers the sheep is eaten; with an **even** number it is safe. For 100 tigers (even), the sheep is **not** eaten.",
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
                solution: "**17 minutes.** The insight: get the two slow people (10 and 5) across **together** so their times overlap.\n\n1. C and D cross → 2 min\n2. D returns with the torch → 1 min\n3. A and B cross (the two slowest, together) → 10 min\n4. C returns → 2 min\n5. C and D cross → 2 min\n\nTotal: 2 + 1 + 10 + 2 + 2 = **17 min**. (Alternatively send C back first then D in round 2 — also 17.)",
                keyIdea: "Pair the two slowest travelers so you only 'pay' for the 10-minute crossing once. Use the fastest people as torch-bearers/ferries."
              },
              {
                title: "Birthday Problem (Cheryl's Birthday)",
                difficulty: "medium",
                tags: ["logic", "deduction", "knowledge"],
                statement: "Boss A's birthday is one of: Mar 4, Mar 5, Mar 8; Jun 4, Jun 7; Sep 1, Sep 5; Dec 1, Dec 2, Dec 8. A tells colleague B only the **month** and colleague C only the **day**. Then:\n\n- B says: *“I don't know A's birthday, but I know C doesn't know it either.”*\n- C says: *“I didn't know A's birthday, but now I know it.”*\n- B says: *“Now I know it too.”*\n\nWhat is A's birthday?",
                hint: "Just follow what each statement reveals about the month and day, step by step.",
                solution: "Days appearing in the list: 1, 2, 4, 5, 7, 8. The unique days are **2** (only Dec 2) and **7** (only Jun 7).\n\n**B's first statement** — *'I know C doesn't know either.'* B knows the month. If the month were Jun or Dec, the day **could** be 7 or 2 (unique days) and C would already know. Since B is sure C doesn't know, the month is **not Jun or Dec**. So the month is Mar or Sep.\n\nRemaining: Mar 4, Mar 5, Sep 1, Sep 5.\n\n**C's statement** — *'Now I know it.'* C knows the day. Among the four left, day 5 appears twice (Mar 5, Sep 5) so it would stay ambiguous. Since C now knows, the day is **4 or 1**, leaving Mar 4 or Sep 1.\n\n**B's second statement** — *'Now I know it too.'* If the month were Mar, both Mar 4 and... actually only Mar 4 remains for March, and only Sep 1 for September — but B must be able to distinguish. March now has a single candidate (Mar 4) and September a single candidate (Sep 1). B knowing the month uniquely pins it down. The consistent answer is **Sep 1**.",
                keyIdea: "Common-knowledge deduction: each statement eliminates possibilities not by revealing the secret directly but by revealing what the speaker *can* and *cannot* deduce."
              },
              {
                title: "Card Game",
                difficulty: "medium",
                tags: ["symmetry", "expected value"],
                statement: "A casino offers a game with a normal 52-card deck. You flip two cards at a time. If both are black they go to the dealer's pile; if both red, to your pile; if mixed, discarded. After all 52 cards, whoever has more cards wins \\$100; otherwise you get nothing. How much would you pay to play?",
                hint: "Use symmetry: every discarded pair removes one red and one black card.",
                solution: "**Pay nothing.** No matter how the deck is arranged, every discarded (mixed) pair removes exactly **one red and one black** card. So the number of red cards remaining for your pile and the number of black cards remaining for the dealer's pile stay **equal** at all times. You always tie. There is no positive expected value, so the game is worth \\$0.",
                keyIdea: "A symmetry/invariant argument: a mixed pair removes one of each color, so red-count and black-count remaining are always equal. The game is always a tie."
              },
              {
                title: "Burning Ropes",
                difficulty: "easy",
                tags: ["logic", "time measurement"],
                statement: "You have two ropes, each of which burns in exactly 1 hour, but burn unevenly (different densities along the rope). Using only these ropes, how do you measure exactly 45 minutes?",
                hint: "Light a rope from both ends and it burns in half the time, regardless of unevenness.",
                solution: "Light **rope 1 at both ends** and **rope 2 at one end** simultaneously.\n\n- Rope 1 burns from both ends → fully consumed in **30 min** (the two flames meet wherever, but together they cover the whole rope in half the total time).\n- At that 30-min mark, rope 2 has 30 min of burn left. Now **light rope 2's other end**. It now burns from both ends → consumed in **15 more minutes**.\n\n30 + 15 = **45 minutes**.",
                keyIdea: "Burning a rope from both ends always halves its time even when burning is uneven, because the two flames jointly consume the whole length."
              },
              {
                title: "Defective Ball (12 Balls)",
                difficulty: "hard",
                tags: ["weighing", "information", "search"],
                statement: "You have 12 identical-looking balls. One is defective — either heavier OR lighter than the rest (you don't know which). Using a balance scale only **3 times**, identify the defective ball (and ideally whether it's heavy or light).",
                hint: "First try it for 9 balls in 2 weighings when you already know the odd one is heavier. The key is to split into three groups of equal size, not two.",
                solution: "Split into **three groups of 4**: {1,2,3,4}, {5,6,7,8}, {9,10,11,12}.\n\n**Weighing 1:** {1,2,3,4} vs {5,6,7,8}.\n\n- **Balanced** → defective is in {9,10,11,12}, and 1-8 are good.\n  - **Weighing 2:** 9,10,11 vs 1,2,3 (known good). If balanced, ball 12 is defective — one more weighing vs a good ball tells heavy/light. If it tips, you know the *direction* for {9,10,11}; **Weighing 3:** 9 vs 10 finds it (the third is the culprit if they balance).\n- **Tips (say left heavy)** → defective is in {1,2,3,4} (possibly heavy) or {5,6,7,8} (possibly light).\n  - **Weighing 2:** 1,2,5 vs 3,4,6. Carefully comparing the tilt against weighing 1 narrows it to at most 3 candidates with a known direction, and **Weighing 3** isolates the ball.\n\nThe full case tree (see the book's Figure 2.1) resolves every scenario in 3 weighings. **General result:** with $n$ weighings you can find the defective ball among up to $(3^n-3)/2$ balls when you don't know heavy-or-light, and up to $3^n$ when you do.",
                keyIdea: "Each 3-way weighing yields one of three outcomes (left, right, balance), so it carries $\\log_2 3$ bits. Splitting into thirds (not halves) maximizes information per weighing."
              },
              {
                title: "Trailing Zeros",
                difficulty: "easy",
                tags: ["number theory", "factorials"],
                statement: "How many trailing zeros are there in 100! (100 factorial)?",
                hint: "Each trailing zero needs a factor of 10 = 2 × 5. Count the 5s — they are rarer than the 2s.",
                solution: "A trailing zero comes from a factor of $10 = 2 \\times 5$. Factors of 2 are far more plentiful than factors of 5, so the count of trailing zeros equals the count of factors of **5** in 100!.\n\n- Multiples of 5 in 1..100: there are $\\lfloor 100/5 \\rfloor = 20$.\n- Multiples of 25 contribute an *extra* 5 each: $\\lfloor 100/25 \\rfloor = 4$.\n\nTotal factors of 5 = 20 + 4 = **24**. So 100! has **24 trailing zeros**.",
                keyIdea: "Count the limiting prime factor (5) using Legendre's formula $\\sum_k \\lfloor n/5^k \\rfloor$."
              },
              {
                title: "Horse Race (25 Horses)",
                difficulty: "medium",
                tags: ["logic", "tournament", "sorting"],
                statement: "There are 25 horses, each running at a distinct constant speed. The track has 5 lanes, so you can race at most 5 horses at a time (and you have no timer — only finishing order). What is the minimum number of races to find the **3 fastest** horses?",
                hint: "Race in 5 groups of 5 first, then think about which horses can still be in the top 3.",
                solution: "**7 races.**\n\n1. **Races 1–5:** Divide into 5 groups of 5; race each. Label by finishing order within group (group 1: horses 1–5 fastest-to-slowest, etc.).\n2. **Race 6:** Race the 5 group-winners (the '1' of each group). Their order ranks the groups. WLOG group A's winner is overall #1.\n   - Eliminate any horse that *cannot* be top 3: the 4th/5th of every group; everything in the two slowest groups; the 2nd/3rd of the 3rd-place group; the 3rd of the 2nd-place group.\n   - Remaining candidates for 2nd/3rd place: the 2nd & 3rd of group A, the 1st & 2nd of group B, and the 1st of group C. The overall #1 is already known (group A's winner).\n3. **Race 7:** Race those remaining candidates; the top 2 are the 2nd and 3rd fastest overall.\n\nTotal = 5 + 1 + 1 = **7 races**.",
                keyIdea: "Prune aggressively after partial orderings: a horse can't be top-3 if 3 horses are already known to beat it. Only 5 candidates survive for the final race."
              },
              {
                title: "Infinite Sequence",
                difficulty: "medium",
                tags: ["algebra", "limits"],
                statement: "If $x^{x^{x^{x^{\\cdots}}}} = 2$ (an infinite power tower), what is $x$?",
                hint: "The exponent tower above the base is itself the same infinite tower.",
                solution: "Let the whole tower equal 2. Since the tower is infinite, the exponent (everything above the bottom $x$) is **also** the same tower, which equals 2. So:\n\n$$x^{(x^{x^{\\cdots}})} = x^2 = 2 \\implies x = \\sqrt{2}.$$\n\nSo $x = \\sqrt{2} \\approx 1.414$.",
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
                solution: "**No.** Use a 3D coloring argument. Partition the 6×6×6 box into 27 small **2×2×2 cubes**, and color them like a 3D checkerboard: 14 'black' cubes and 13 'white' cubes (or vice versa).\n\nKey fact: any 1×1×4 brick placed in the box must cover exactly **2 units in a black 2×2×2 cube and 2 units in a white one** — every brick straddles equal black/white volume.\n\nEach 2×2×2 cube has volume 8, so a brick occupies 2 of one color and 2 of the other. With 13 cubes of the minority color we can place at most $52$ brick-units worth into them... more precisely the minority color provides only enough capacity for 52 of the 1×1×4 tubes' worth of coverage, so at most **52** bricks fit. The 53rd cannot be placed. Hence 53 bricks **cannot** be packed.",
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
                solution: "Look at the **red** count after each move:\n\n- Two blues drawn → add a blue: reds unchanged.\n- Two reds drawn → add a blue: reds decrease by **2**.\n- One red, one blue → add a red: reds unchanged (the red is replaced).\n\nSo the **parity of the red count is invariant** — it never changes.\n\n- Start with **14 reds (even)** → reds stay even, so the count can reach 0; the last ball is **blue**.\n- Start with **13 reds (odd)** → reds stay odd, so the last ball must be **red**.",
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
                solution: "Take **any 20 coins** and put them in pile A; the other 980 are pile B. Say pile A happens to contain $m$ heads (so $20 - m$ tails). Then pile B contains the remaining $20 - m$ heads.\n\nNow **flip every coin in pile A.** Its $m$ heads become tails and its $20 - m$ tails become **heads**. So pile A now has $20 - m$ heads — exactly matching pile B!\n\nThis works regardless of $m$, even though you never knew any coin's orientation.",
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
                solution: "Appoint one **spokesman** (counter). The other 49 are all equivalent (symmetric), so they follow one rule:\n\n- **Each of the 49 ordinary men:** the *first time* he is called and finds the glass **down**, he flips it **up**. After he has done this once, he never touches the glass again. (If the glass is already up when called, he does nothing.)\n- **The spokesman:** whenever he is called and finds the glass **up**, he flips it **down** and adds 1 to his count. If the glass is down, he does nothing.\n\nEach ordinary man flips the glass up **exactly once** in his life, and only the spokesman ever flips it down. So each 'up→down' the spokesman performs corresponds to a *distinct* new man having been called. When his count reaches **49**, all 49 others (plus himself) have been called — he declares everyone free.",
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
                solution: "Let the missing integers be $x$ and $y$. Compare your set's totals to the full 1..100 totals:\n\n$$x + y = \\frac{100 \\cdot 101}{2} - \\sum_{i} z_i$$\n$$x^2 + y^2 = \\frac{100 \\cdot 101 \\cdot 201}{6} - \\sum_{i} z_i^2$$\n\nTwo equations, two unknowns → solve for $x$ and $y$. This runs in $O(n)$ time with $O(1)$ extra space.",
                keyIdea: "Two unknowns need two independent equations; the sum and the sum of squares (first two power sums) suffice."
              },
              {
                title: "Counterfeit Coins I",
                difficulty: "medium",
                tags: ["weighing", "encoding"],
                statement: "There are 10 bags with 100 identical-looking coins each. In all but one bag, each coin weighs 10 g. In the counterfeit bag every coin weighs either 9 g or 11 g (all the same, you're told only that they differ). Using a **digital scale** just **once**, identify the counterfeit bag.",
                hint: "Take a different number of coins from each bag so the deviation reveals which bag.",
                solution: "Take **1 coin from bag 1, 2 from bag 2, …, 10 from bag 10** — total $\\sum_{i=1}^{10} i = 55$ coins. If all were genuine they'd weigh $550$ g.\n\nIf bag $i$ is counterfeit, the total is off by $\\pm i$ grams (since you took $i$ of its coins, each $\\pm1$ g off). So the reading is $550 \\pm i$. The size of the deviation $|reading - 550|$ tells you the bag number, and the sign tells you whether they're light or heavy.",
                keyIdea: "Encode each bag with a unique multiplier (distinct coin counts) so a single measurement carries a recoverable signature of which bag deviated."
              },
              {
                title: "Glass Balls (Egg Drop)",
                difficulty: "medium",
                tags: ["optimization", "search", "series"],
                statement: "You have two identical glass balls and a 100-story building. A ball breaks if dropped from floor X or above, and survives below X. Find the strategy that **minimizes the number of drops in the worst case** to determine X.",
                hint: "If your first ball can be dropped at most N times, the gaps between test floors should shrink by 1 each time.",
                solution: "Let $N$ be the worst-case number of drops. Drop ball 1 at floors with **shrinking gaps**: first at floor $N$, then $N + (N-1)$, then $N + (N-1) + (N-2)$, … Each time ball 1 survives you've used one drop and can afford one fewer floor in the next jump; if it breaks, ball 2 sweeps the floors below linearly.\n\nThe floors covered must reach 100: $N + (N-1) + \\cdots + 1 = \\tfrac{N(N+1)}{2} \\ge 100$, giving $N = 14$.\n\nSo start at floor **14**; if it survives go to 27, then 39, …; if it breaks at any point, sweep upward one floor at a time with ball 2. Worst case: **14 drops**.",
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
                solution: "Pick any person P. Among the other 5, by pigeonhole either **≥3 are acquaintances** of P or **≥3 are strangers** to P. Say P has 3 acquaintances A, B, C.\n\n- If **any pair** among A, B, C met each other, that pair plus P form 3 mutual acquaintances. ✓\n- If **no pair** among A, B, C met, then A, B, C are 3 mutual strangers. ✓\n\nThe stranger case is symmetric. So one of the two conclusions always holds. (This is the Ramsey number $R(3,3) = 6$.)",
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
                solution: "**One weighing** suffices, using base-3-style encoding. Take coin counts that grow fast enough that each bag's $\\pm$ deviation lands in a non-overlapping range. The book's choice: take **1, 3, 9, 27, 81** coins from bags 1–5 respectively.\n\nEach bag $i$ contributes a deviation of $c_i \\times \\{-1, 0, +1\\}$ grams where $c_i \\in \\{1,3,9,27,81\\}$. Because these are powers of 3, every combination of per-bag deviations produces a **distinct** total deviation (this is balanced ternary). So one scale reading uniquely decodes the type of all 5 bags.",
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
                solution: "**At least 99 can be saved.**\n\n- **2 colors:** The last prisoner (sees all 99 ahead) announces the **parity** of red hats he sees (say 'red' if odd, 'blue' if even). He has a 50% chance personally. Everyone else can now deduce their own hat: each prisoner tracks the parity of reds they see ahead plus what's been called behind them, and infers their own color exactly. So 99 are guaranteed.\n- **3 colors (red=0, green=1, blue=2):** The first prisoner announces the **sum of all hats he sees, mod 3**. Each subsequent prisoner computes the running total of hats they see ahead plus those announced behind, and subtracts from the announced sum mod 3 to get their own color. Again **99 guaranteed**.",
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
                solution: "**No.** Track the three counts mod 3. The starting counts are $(13, 15, 17) \\equiv (1, 0, 2) \\pmod 3$ — all three residues are **different**.\n\nWhen two different colors meet, two counts each drop by 1 and the third rises by 2. Modulo 3, $-1 \\equiv +2$, so **all three counts shift by the same amount mod 3** — meaning their pairwise *differences* mod 3 are preserved. Since they start all-distinct mod 3, they can never become two-equal-and-one-zero, let alone all equal (which would require all residues equal). Hence they can never all become one color.",
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
                solution: "**Claim:** for $n$ coins the total is always $\\tfrac{n(n-1)}{2}$, independent of the splitting.\n\nLet $f(n)$ be the total. Base cases: $f(1)=0$, $f(2)=1$. If $n$ coins split into $x$ and $n-x$, then $f(n) = x(n-x) + f(x) + f(n-x)$. Assume the claim for all sizes $< n$:\n$$f(n) = x(n-x) + \\frac{x(x-1)}{2} + \\frac{(n-x)(n-x-1)}{2} = \\frac{n(n-1)}{2}.$$\n(The algebra simplifies cleanly.) So by strong induction, $f(n) = \\tfrac{n(n-1)}{2}$ for all $n$.\n\nFor 1000 coins: $f(1000) = \\tfrac{1000 \\cdot 999}{2} = 499500$.",
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
                solution: "**Induction on $N$.** Base $N=1$: the single can has all the gas, start there. \n\n**Inductive step:** With $N$ cans, there must exist some can $i$ that holds **enough gas to reach the next can $i+1$** (if no can could reach its neighbor, the total gas would be less than the total distance — contradiction). 'Merge' can $i+1$ into can $i$: move its gas to position $i$. This reduces the problem to $N-1$ cans with the same total gas, which by the inductive hypothesis has a valid start. That start works for the original problem too (the car reaches $x_i$, picks up its gas, and has enough to continue past $x_{i+1}$).\n\n**Alternative:** start at the can following the point of lowest cumulative gas balance.",
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
                solution: "Suppose $\\sqrt 2$ is rational: $\\sqrt 2 = m/n$ in **lowest terms** (m, n share no common factor). Then $m^2 = 2n^2$, so $m^2$ is even, hence $m$ is even — write $m = 2x$. Then $4x^2 = 2n^2 \\Rightarrow n^2 = 2x^2$, so $n^2$ is even and $n$ is even too. But then $m$ and $n$ share the factor 2 — contradicting 'lowest terms'. Therefore $\\sqrt 2$ is irrational.",
                keyIdea: "Assume the negation (rational, in lowest terms), then derive that both numerator and denominator are even — a contradiction with the reduced-fraction assumption."
              },
              {
                title: "Rainbow Hats (7 Prisoners)",
                difficulty: "hard",
                tags: ["modular", "protocol", "contradiction"],
                statement: "7 prisoners each get a hat in one of 7 rainbow colors (repeats allowed). Each sees the other 6 hats but not their own; they can't communicate. All write down a guess simultaneously. If **at least one** guesses correctly, all go free. Find a strategy that guarantees freedom.",
                hint: "Code the colors 0–6. Make prisoner i guess so the total sum ≡ i (mod 7).",
                solution: "Code the colors as $0, 1, \\dots, 6$. Let $x_j$ be prisoner $j$'s (unknown to him) hat color. Prisoner $i$ guesses the value $g_i$ that makes the **total** sum of all 7 hats $\\equiv i \\pmod 7$ — i.e. he sets his own guess so that $\\left(g_i + \\sum_{j \\ne i} x_j\\right) \\equiv i \\pmod 7$.\n\nThe **actual** total $S = \\sum_j x_j$ has some fixed residue $r = S \\bmod 7$, where $r \\in \\{0,\\dots,6\\}$. Prisoner $r$'s guess assumes the total is $\\equiv r$ — which is exactly true! So prisoner $r$ guesses his own hat correctly. Since $r$ is always one of $0..6$, **at least one prisoner is always right**.\n\n(By contradiction: if every prisoner were wrong, the true sum would avoid all 7 residues mod 7 — impossible.)",
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
          { id: "3.1", title: "Limits and Derivatives", problems: [ph("Basics of derivatives"), ph("Maximum and minimum"), ph("L'Hospital's rule")] },
          { id: "3.2", title: "Integration", problems: [ph("Basics of integration"), ph("Applications of integration"), ph("Expected value using integration")] },
          { id: "3.3", title: "Partial Derivatives & Multiple Integrals", problems: [ph("Partial derivatives and multiple integrals")] },
          { id: "3.4", title: "Important Calculus Methods", problems: [ph("Taylor's series"), ph("Newton's method"), ph("Lagrange multipliers")] },
          { id: "3.5", title: "Ordinary Differential Equations", problems: [ph("Separable differential equations"), ph("First-order linear differential equations"), ph("Homogeneous linear equations"), ph("Nonhomogeneous linear equations")] },
          { id: "3.6", title: "Linear Algebra", problems: [ph("Vectors"), ph("QR decomposition"), ph("Determinant, eigenvalue and eigenvector"), ph("Positive semidefinite/definite matrix"), ph("LU and Cholesky decomposition")] }
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
                solution: "Remove A's last coin so A and B each have $n$ coins. After flipping those, exactly one of three things is true:\n\n- $E_1$: A's $n$ coins beat B's $n$ coins (more heads),\n- $E_2$: A's equal B's,\n- $E_3$: A's have fewer.\n\nBy symmetry $P(E_1) = P(E_3) = y$, and let $P(E_2) = x$. Since $2y + x = 1$.\n\nNow flip A's extra $(n+1)$-th coin:\n- If A was already ahead ($E_1$), A still wins regardless — contributes $y$.\n- If A was tied ($E_2$), the extra coin makes A win with probability $1/2$ — contributes $x/2$.\n\nTotal $P(\\text{A wins}) = y + x/2 = y + \\tfrac{1}{2}(1 - 2y) = \\tfrac{1}{2}$.\n\n**The answer is exactly $1/2$**, independent of $n$.",
                keyIdea: "Strip away the asymmetry (the extra coin) to expose a symmetric core, then let the tie-breaking coin do the rest. The clean answer $1/2$ falls out without summing binomials."
              },
              {
                title: "Card Game",
                difficulty: "medium",
                tags: ["symmetry", "expected value", "counting"],
                statement: "A 52-card deck has 4 cards of each value 2,3,…,10,J,Q,K,A. You draw one card; the dealer then draws another (no replacement). Higher number wins (ties: house wins). What is your probability of winning?",
                hint: "Compare three symmetric events: your card higher, equal, or lower than the dealer's.",
                solution: "Define three events when comparing your card to the dealer's: $E_1$ yours higher, $E_2$ equal, $E_3$ lower. By symmetry $P(E_1) = P(E_3)$.\n\nGiven your card, 51 cards remain and exactly 3 share its value, so $P(E_2) = 3/51$. Thus\n$$P(\\text{win}) = P(E_1) = \\frac{1 - P(E_2)}{2} = \\frac{1 - 3/51}{2} = \\frac{8}{17}.$$\n\n(Equivalently, sum over all 13 possible card values: $\\frac{1}{13}\\big(\\tfrac{0}{51} + \\tfrac{4}{51} + \\cdots + \\tfrac{48}{51}\\big) = \\frac{8}{17}$.)",
                keyIdea: "Symmetry between 'you higher' and 'dealer higher' reduces the problem to computing the tie probability $3/51$."
              },
              {
                title: "Drunk Passenger",
                difficulty: "hard",
                tags: ["symmetry", "recursion"],
                statement: "100 passengers board a plane with 100 assigned seats. The first (drunk) passenger sits in a uniformly random seat. Each later passenger takes their own seat if free, otherwise a random free seat. What is the probability that the **last** passenger gets their own seat (#100)?",
                hint: "Focus only on seats #1 and #100. By symmetry, which gets taken first?",
                solution: "Consider only seat #1 (the drunk's own seat) and seat #100 (the last passenger's seat). The process ends as soon as one of these two is occupied:\n\n- If seat #100 is taken before seat #1, the last passenger is displaced.\n- If seat #1 is taken before seat #100, the last passenger gets #100.\n\nEvery time a displaced passenger picks randomly, seats #1 and #100 are equally likely to be chosen among the relevant options. By **symmetry**, seat #1 and seat #100 are equally likely to be the one taken first. So the probability the last passenger sits in #100 is exactly **$1/2$** — independent of the number of passengers.",
                keyIdea: "Collapse a 100-step process to a race between two equally-likely seats. Symmetry gives $1/2$ with no recursion needed."
              },
              {
                title: "N Points on a Circle",
                difficulty: "hard",
                tags: ["geometry", "mutually exclusive events"],
                statement: "$N$ points are drawn uniformly at random on the circumference of a circle. What is the probability that all $N$ points lie within some **semicircle**?",
                hint: "Consider the event that, starting from point $n$ and going clockwise, all other points fall in the clockwise semicircle. Are these events (over the starting point) mutually exclusive?",
                solution: "Label the points $1,\\dots,N$. Let $E_i$ be the event that, starting at point $i$ and sweeping **clockwise**, the next half-circle contains all the other $N-1$ points. Each $E_i$ has probability $(1/2)^{N-1}$ (each of the other points independently lands in that specific semicircle).\n\nThese events are **mutually exclusive**: if all points fit in a clockwise semicircle starting at $i$, then no other point $j$ can also be the clockwise-most start. So\n$$P\\Big(\\bigcup_{i=1}^N E_i\\Big) = \\sum_{i=1}^N P(E_i) = N \\cdot \\frac{1}{2^{N-1}} = \\frac{N}{2^{N-1}}.$$\n\n(More generally, for an arc of length fraction $x \\le 1/2$ of the circle, the probability is $N x^{N-1}$.)",
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
                solution: "For every group of 5 pirates there must be a **lock none of them can open** (so they can't reach the treasure), yet any 6th pirate can. So assign one distinct lock to each 5-pirate subset, and give its key to the **other 6** pirates.\n\nNumber of locks $= \\binom{11}{5} = 462$.\n\nEach lock's key is held by 6 pirates, so total key-holdings $= 462 \\times 6$, shared over 11 pirates:\n$$\\frac{462 \\times 6}{11} = 252 \\text{ keys per pirate}.$$\n\n(This is Shamir's *How to Share a Secret* setup.)",
                keyIdea: "Map each minimal 'forbidden' coalition to a lock; the complement holds its key. Threshold access = a combinatorial design problem."
              },
              {
                title: "Chess Tournament",
                difficulty: "medium",
                tags: ["counting", "probability", "recursion"],
                statement: "$2^n$ players with strictly ordered skills (player 1 best) play a single-elimination knockout; the better player always wins. Pairings each round are random. What is the probability that players 1 and 2 meet in the **final**?",
                hint: "For them to meet in the final they must be drawn into different halves of the bracket.",
                solution: "Players 1 and 2 meet in the final **iff** they are placed in different halves of the bracket (each half has $2^{n-1}$ players). Player 1 takes one slot; player 2 must land in the opposite half: of the remaining $2^n - 1$ slots, $2^{n-1}$ are in the other half. So\n$$P = \\frac{2^{n-1}}{2^n - 1}.$$\n\n(Equivalently via conditional probabilities round by round, the telescoping product gives the same result.)",
                keyIdea: "The whole tournament reduces to one question: do the two top players start in different halves? Counting slots beats multiplying round-by-round probabilities."
              },
              {
                title: "Application Letters",
                difficulty: "medium",
                tags: ["inclusion-exclusion", "derangement"],
                statement: "You have 5 personalized cover letters and 5 addressed envelopes. Your toddler stuffs each letter into a random envelope (a random permutation). What is the probability that **all 5** letters go to the wrong envelope?",
                hint: "Use inclusion–exclusion on the events $E_i$ = 'letter $i$ is in the correct envelope.'",
                solution: "Let $E_i$ be the event letter $i$ is correct. We want $1 - P(\\bigcup E_i)$. By inclusion–exclusion,\n$$P\\Big(\\bigcup_{i=1}^5 E_i\\Big) = \\sum P(E_i) - \\sum P(E_iE_j) + \\cdots = \\frac{1}{1!} - \\frac{1}{2!} + \\frac{1}{3!} - \\frac{1}{4!} + \\frac{1}{5!} = \\frac{19}{30}.$$\nSo the probability **all** are wrong (a derangement) is\n$$1 - \\frac{19}{30} = \\frac{11}{30} \\approx 0.367.$$\n(As $n \\to \\infty$ this tends to $1/e$.)",
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
                solution: "By the binomial theorem, the irrational ($\\sqrt2$) terms in $(1+\\sqrt2)^n$ and $(1-\\sqrt2)^n$ cancel when added, so\n$$(1+\\sqrt2)^{3000} + (1-\\sqrt2)^{3000}$$\nis an **integer**. Now $|1 - \\sqrt2| \\approx 0.414 < 1$, so $(1-\\sqrt2)^{3000}$ is positive and astronomically small — about $0 < (\\sqrt2-1)^{3000} \\ll 10^{-100}$.\n\nTherefore $(1+\\sqrt2)^{3000}$ equals an integer **minus** that tiny positive number, i.e. it is just barely below an integer: its decimal expansion is $\\ldots999\\ldots$. So the 100th digit after the decimal point is **9**.",
                keyIdea: "Add the conjugate to manufacture an integer; the conjugate's tiny magnitude forces a long run of 9s just below an integer."
              },
              {
                title: "Cubic of Integer",
                difficulty: "medium",
                tags: ["binomial theorem", "modular"],
                statement: "If an integer $x$ is chosen uniformly between 1 and $10^{12}$, what is the probability that $x^3$ ends in **11** (its last two digits are 11)?",
                hint: "The last two digits of $x^3$ depend only on the last two digits of $x$.",
                solution: "Write $x = a + 10b$ where $a$ is the last digit. Then $x^3 = a^3 + 30a^2 b + 300ab^2 + 1000b^3$, so the **units digit** of $x^3$ depends only on $a^3$, and the **tens digit** depends on $a$ and $b$.\n\nFor the units digit to be 1, we need $a^3 \\equiv 1 \\pmod{10}$, which forces $a = 1$. Then the tens digit of $x^3$ comes from $30a^2 b = 30b$, i.e. $3b \\bmod 10$. We need this $\\equiv 1$, so $b \\equiv 7 \\pmod{10}$.\n\nSo exactly one residue of $a$ (out of 10) and one residue of $b$ (out of 10) work → probability $\\frac{1}{10} \\times \\frac{1}{10} = \\frac{1}{100} = 1\\%$.",
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
                solution: "Sample space (older, younger): $\\{bb, bg, gb, gg\\}$, each prob $1/4$.\n\n**Part A** — given *at least one boy*, the event 'both boys' is\n$$P(bb \\mid \\text{at least one boy}) = \\frac{1/4}{3/4} = \\frac{1}{3}.$$\n\n**Part B** — you've identified a *specific* child (the one walking) as a boy. That child's sibling is independently equally likely to be a boy or girl, so the probability both are boys is $\\frac{1}{2}$.\n\nThe subtle difference: Part A conditions on the *set* having a boy; Part B conditions on a *particular* child being a boy.",
                keyIdea: "The information you condition on determines the answer. 'At least one is a boy' (1/3) ≠ 'this specific one is a boy' (1/2)."
              },
              {
                title: "All-Girl World?",
                difficulty: "medium",
                tags: ["expectation", "intuition"],
                statement: "In a society every couple keeps having children until they get a girl, then stops. Genders are independent with $P(\\text{girl}) = 1/2$. Will this society end up with more girls than boys?",
                hint: "Gender at birth doesn't depend on the stopping rule. What fraction of all births are girls?",
                solution: "**No — the ratio stays 50/50.** The stopping rule cannot change the gender distribution of any individual birth: every newborn is independently a girl or boy with probability $1/2$, regardless of family planning. So across all births, exactly half are girls. The 'preference' changes family *sizes*, not the *sex ratio*.",
                keyIdea: "A stopping rule based on outcomes cannot bias the underlying independent process. Expected boys = expected girls."
              },
              {
                title: "Unfair Coin",
                difficulty: "medium",
                tags: ["Bayes"],
                statement: "Among 1000 coins, 1 is double-headed; the other 999 are fair. You pick a coin at random and toss it 10 times — all 10 come up heads. What's the probability you picked the unfair coin?",
                hint: "Bayes: combine the prior 1/1000 with the likelihood of 10 heads under each hypothesis.",
                solution: "Let $A$ = picked the unfair coin, $B$ = 10 heads. Priors $P(A) = 1/1000$, $P(A^c) = 999/1000$. Likelihoods $P(B|A) = 1$, $P(B|A^c) = (1/2)^{10} = 1/1024$. By Bayes:\n$$P(A|B) = \\frac{1 \\cdot \\tfrac{1}{1000}}{1 \\cdot \\tfrac{1}{1000} + \\tfrac{1}{1024}\\cdot\\tfrac{999}{1000}} \\approx 0.506 \\approx 0.5.$$",
                keyIdea: "Strong evidence (10 heads) updates a tiny prior (1/1000) to roughly even odds — because 10 heads is itself ~1/1000 likely for a fair coin."
              },
              {
                title: "Fair Probability from an Unfair Coin",
                difficulty: "medium",
                tags: ["symmetry", "algorithm"],
                statement: "You have a biased coin with unknown $P(\\text{head}) = p_H$. How do you simulate a fair 50/50 outcome?",
                hint: "Use two tosses and exploit a symmetry between two of the outcomes.",
                solution: "Toss the coin **twice**. The four outcomes have probabilities:\n- $HH$: $p_H^2$,  $TT$: $p_T^2$,  $HT$: $p_H p_T$,  $TH$: $p_T p_H$.\n\nCrucially $P(HT) = P(TH) = p_H p_T$. So: map $HT \\to$ 'win', $TH \\to$ 'lose', and **re-toss** if you get $HH$ or $TT$. The two retained outcomes are equally likely → fair odds.",
                keyIdea: "Von Neumann's trick: the two mixed outcomes $HT$ and $TH$ are always equiprobable regardless of bias; discard the symmetric ties."
              },
              {
                title: "Dart Game",
                difficulty: "medium",
                tags: ["symmetry", "order", "independence"],
                statement: "Jason throws darts aiming at the center; skill is constant. The 2nd dart lands farther from center than the 1st. What is the probability the 3rd dart is farther from center than the **1st**? (General: $n$ darts.)",
                hint: "Rank the throws by distance. Is 'the last throw is the best' independent of the order of the earlier throws?",
                solution: "Each dart's distance is i.i.d., so all orderings are equally likely. The question reduces to: given the 1st of $n$ throws is the best (closest) so far, what is $P(\\text{the }(n{+}1)\\text{-th throw is *not* the new best})$?\n\nThe event '$(n{+}1)$-th is the best among $n+1$ throws' has probability $\\frac{1}{n+1}$, and (by symmetry) is **independent** of how the first $n$ are ordered. So given the first throw is best of the first $n$, the probability the next throw is *worse* than the first is $1 - \\frac{1}{n+1} = \\frac{n}{n+1}$.\n\nFor 3 darts ($n=2$): the answer is $\\frac{2}{3}$.",
                keyIdea: "Among i.i.d. values, 'the newest one is the maximum' has probability $1/(n+1)$ and is independent of the earlier ordering — a recurring symmetry trick."
              },
              {
                title: "Birthday Line",
                difficulty: "hard",
                tags: ["optimization", "conditional probability"],
                statement: "A theater gives a free ticket to the first person in line whose birthday matches someone earlier in line. Which position maximizes your chance of winning? (365 equally likely days.)",
                hint: "To win at position $n$: the first $n-1$ people must all have distinct birthdays, AND yours must match one of them.",
                solution: "At position $n$ you win iff the first $n-1$ birthdays are all distinct **and** yours matches one of them:\n$$P(n) = \\underbrace{\\frac{365 \\cdot 364 \\cdots (365-n+2)}{365^{n-1}}}_{\\text{first }n-1\\text{ distinct}} \\times \\frac{n-1}{365}.$$\nFind where $P(n)$ peaks by requiring $P(n) > P(n-1)$ and $P(n) > P(n+1)$. This yields the quadratic conditions $n^2 - n - 365 < 0$ and $n^2 - 3n - 363 > 0$, giving $n = 20$.\n\n**Stand 20th in line.**",
                keyIdea: "Trade-off: deeper in line raises your match chance but lowers the chance the earlier birthdays are still all distinct. The product peaks at position 20."
              },
              {
                title: "Dice Order",
                difficulty: "easy",
                tags: ["conditional probability", "permutations"],
                statement: "Roll three dice one by one. What is the probability the three values are in **strictly increasing** order?",
                hint: "Condition on the three numbers being different.",
                solution: "Strictly increasing requires three distinct values. $P(\\text{all different}) = 1 \\cdot \\tfrac{5}{6} \\cdot \\tfrac{4}{6} = \\tfrac{20}{36}$. Given three different values, exactly 1 of their $3! = 6$ orderings is increasing, so $P(\\text{increasing} \\mid \\text{distinct}) = \\tfrac{1}{6}$. Hence\n$$P = \\frac{20}{36} \\times \\frac{1}{6} = \\frac{20}{216} = \\frac{5}{54}.$$",
                keyIdea: "Split into 'distinct values' × 'correct ordering given distinct' — the ordering factor is simply $1/3!$."
              },
              {
                title: "Monty Hall Problem",
                difficulty: "medium",
                tags: ["conditional probability", "Bayes"],
                statement: "Three doors: one hides a car, two hide goats. You pick a door; the host (who knows) opens a different door revealing a goat, then offers you the switch. Should you switch?",
                hint: "The host's action is not independent of where the car is. What's the chance your original pick was wrong?",
                solution: "**Yes, switch — you win with probability $2/3$.** With a switching strategy you win exactly when your original pick was a **goat** (probability $2/3$), because the host then reveals the other goat and switching lands on the car. If you originally picked the car ($1/3$), switching loses. So switching wins $2/3$ of the time vs. $1/3$ for staying.",
                keyIdea: "The host's informed action transfers probability. Your initial guess is wrong 2/3 of the time, and switching converts every one of those into a win."
              },
              {
                title: "Amoeba Population",
                difficulty: "hard",
                tags: ["law of total probability", "branching process"],
                statement: "One amoeba each minute, with equal probability $1/4$, dies / stays the same / splits into two / splits into three (offspring behave independently). What is the probability the population eventually dies out?",
                hint: "Condition on the first minute and set up an equation: $P = \\sum P(\\text{extinct}\\,|\\,F_i)P(F_i)$.",
                solution: "Let $P$ be the extinction probability starting from one amoeba. Condition on the first minute's four equally likely events. If it splits into $k$ amoebas, each independently goes extinct with probability $P$, so that branch contributes $P^k$:\n$$P = \\frac{1}{4}\\cdot 1 + \\frac{1}{4}\\cdot P + \\frac{1}{4}\\cdot P^2 + \\frac{1}{4}\\cdot P^3.$$\nSolve $P^3 + P^2 - 3P + 1 = 0$. One root is $P = 1$; factoring gives the others, and the valid root in $(0,1)$ is\n$$P = \\sqrt2 - 1 \\approx 0.414.$$",
                keyIdea: "Branching-process extinction: independence makes a $k$-way split contribute $P^k$, yielding a fixed-point polynomial whose relevant root lies in $(0,1)$."
              },
              {
                title: "Candies in a Jar",
                difficulty: "hard",
                tags: ["conditional probability", "symmetry"],
                statement: "A jar has 10 red, 20 blue, 30 green candies. Drawing one at a time without replacement, what's the probability that at least 1 blue and 1 green remain when the **last red** is drawn?",
                hint: "Reframe via the *last* candy of each color. You want the red color to be exhausted before blue and before green.",
                solution: "Let $T_r, T_b, T_g$ be the positions of the **last** red/blue/green candy. We want $T_r < T_b$ **and** $T_r < T_g$ (reds run out before blue and green do). Decompose:\n$$P = P(T_r < T_b < T_g) + P(T_r < T_g < T_b).$$\n\n- $P(T_b < T_g \\text{ with } T_r \\text{ smallest})$: the very last candy is green with prob $\\tfrac{30}{60}$; given that, the last among red+blue is blue with prob $\\tfrac{20}{30}$ → $\\tfrac{30}{60}\\cdot\\tfrac{20}{30}$.\n- The other case: last candy blue $\\tfrac{20}{60}$, then last of red+green is green $\\tfrac{30}{40}$ → $\\tfrac{20}{60}\\cdot\\tfrac{30}{40}$.\n\n$$P = \\frac{30}{60}\\cdot\\frac{20}{30} + \\frac{20}{60}\\cdot\\frac{30}{40} = \\frac{1}{3} + \\frac{1}{4} = \\frac{7}{12}.$$",
                keyIdea: "Translate 'reds run out first' into orderings of the *last* candy of each color; each color is equally likely to be last among any subset."
              },
              {
                title: "Coin Toss Game (A & B)",
                difficulty: "hard",
                tags: ["conditional probability", "symmetry"],
                statement: "A and B alternately toss a fair coin (A first). The game stops at the first occurrence of a **head immediately followed by a tail** (HT); whoever tossed that tail wins. What is the probability A wins?",
                hint: "Condition on A's first toss and use symmetry between the players' positions.",
                solution: "Let $P(A)$ be A's win probability. Condition on A's first toss:\n\n- If A throws **T** (prob $1/2$): an $H$ is still needed before any $HT$, so B is now effectively the 'first' tosser → A's chance becomes $1 - P(A)$.\n- If A throws **H** (prob $1/2$): condition on B's next toss. With prob $1/2$ B throws $T$ — that completes $HT$ and **A loses** (B tossed the winning tail)... carefully tracking the recursion gives A's chance $1/3$ in this branch.\n\nCombining: $P(A) = \\tfrac{1}{2}\\cdot\\tfrac{1}{3} + \\tfrac{1}{2}\\big(1 - P(A)\\big) \\Rightarrow P(A) = \\frac{4}{9}.$\n\nSanity check: $P(A) < 1/2$ is reasonable since A cannot win on the very first toss (no preceding head).",
                keyIdea: "Set up a self-referential equation by conditioning on the first toss; symmetry lets you express sub-cases as $1 - P(A)$."
              },
              {
                title: "Russian Roulette Series",
                difficulty: "medium",
                tags: ["conditional probability"],
                statement: "A 6-chamber revolver, one bullet, barrel spun once so each chamber is equally likely. Two players take turns pulling the trigger (no re-spin). Would you go first or second? Variant: re-spin before every pull. Variant: two bullets in consecutive chambers, opponent survives the first pull — should you spin before your turn?",
                hint: "Once spun, the bullet's position is fixed — count which trigger pulls hit it.",
                solution: "**No re-spin:** the bullet sits in chambers 1–6 equally likely. Player 1 fires chambers 1,3,5; player 2 fires 2,4,6 — each set is 3 of 6, so **$1/2$ each**. Order doesn't matter.\n\n**Re-spin each pull:** now pulls are independent. First player loses with prob $p = 1/6$; second player loses only if first survives: condition to get $p = \\frac{1}{6}, \\text{ then } \\frac{5}{6}\\cdot\\frac{1}{6}\\cdots$, giving the second player loss prob $5/11$. **Choose to go second (5/11 < 6/11).**\n\n**Two consecutive bullets, opponent survived pull 1:** the surviving (empty) chamber was one of the 4 empties. Of those, only 1 is followed by a bullet, 3 are followed by an empty. So if you **don't** spin, your survival prob is $3/4$; if you **spin**, survival is $4/6 = 2/3$. **Don't spin.**",
                keyIdea: "Distinguish independent (re-spin) from dependent (fixed bullet) trials. Conditioning on the survived chamber reshapes the odds."
              },
              {
                title: "Aces",
                difficulty: "medium",
                tags: ["conditional probability", "counting"],
                statement: "52 cards are dealt to 4 players, 13 each. What is the probability that **every** player gets exactly one ace?",
                hint: "Place the aces one at a time and track the conditional probability each lands in a fresh pile.",
                solution: "Place the aces sequentially. The first ace goes somewhere; the second must avoid that ace's pile: $\\frac{52-13}{51} = \\frac{39}{51}$. The third avoids both used piles: $\\frac{26}{50}$. The fourth: $\\frac{13}{49}$. So\n$$P = \\frac{39}{51}\\times\\frac{26}{50}\\times\\frac{13}{49} \\approx 0.105.$$\n(Equivalently the multinomial count $4!\\cdot\\frac{48!}{12!^4} \\big/ \\frac{52!}{13!^4}$.)",
                keyIdea: "Sequential conditioning: each new ace must fall into one of the not-yet-used piles, with shrinking favorable counts."
              },
              {
                title: "Gambler's Ruin Problem",
                difficulty: "hard",
                tags: ["difference equations", "random walk"],
                statement: "A gambler starts with \\$$i$, bets \\$1 each round, winning with prob $p$ (losing with $q = 1-p$). He stops at \\$0 (ruin) or \\$$N$ (goal). What is the probability he reaches \\$$N$?",
                hint: "Let $P_i$ be the win probability from state $i$; set up the recurrence $P_i = pP_{i+1} + qP_{i-1}$.",
                solution: "From state $i$: $P_i = pP_{i+1} + qP_{i-1}$, with $P_0 = 0$, $P_N = 1$. Rewriting, $P_{i+1} - P_i = \\frac{q}{p}(P_i - P_{i-1})$, so the differences form a geometric sequence. Summing:\n$$P_i = \\begin{cases} \\dfrac{1 - (q/p)^i}{1 - (q/p)^N}, & p \\ne 1/2,\\\\[2mm] \\dfrac{i}{N}, & p = 1/2. \\end{cases}$$",
                keyIdea: "A linear difference equation with boundary conditions. The ratio $q/p$ drives a geometric solution; the fair case degenerates to the linear $i/N$."
              },
              {
                title: "Basketball Scores",
                difficulty: "hard",
                tags: ["induction", "law of total probability"],
                statement: "A player takes 100 free throws. The 1st shot scores 1 point, 1st miss scores 0; thereafter the probability of a make equals the fraction of shots made so far. After the first 2 shots (one make, one miss), what is the probability the player ends with exactly 50 makes in 100 shots?",
                hint: "Let $P_{n,k}$ = prob of $k$ makes in $n$ shots. Compute small cases — the make-count is uniformly distributed.",
                solution: "Let $P_{n,k}$ be the probability of $k$ baskets after $n$ shots (starting from the state after shot 2: 1 make, 1 miss). Computing $n=3$: $P_{3,1} = P_{3,2} = 1/2$. By induction one shows the remarkable result\n$$P_{n,k} = \\frac{1}{n-1}, \\quad k = 1, \\dots, n-1,$$\ni.e. the number of made shots is **uniformly distributed**. The induction step uses the law of total probability with the self-reinforcing make probability $k/n$.\n\nFor $n = 100$: $P_{100,50} = \\frac{1}{99}$.",
                keyIdea: "A Pólya-urn-like reinforcement makes every possible make-count equally likely — the answer is uniform $\\frac{1}{n-1}$."
              },
              {
                title: "Cars on Road",
                difficulty: "medium",
                tags: ["independence", "complement"],
                statement: "On a highway the probability of seeing at least one car in 20 minutes is $609/625$. Assuming a constant arrival rate and independence across disjoint intervals, what is the probability of seeing at least one car in **5 minutes**?",
                hint: "20 minutes = four independent 5-minute intervals. Work with the no-car probabilities.",
                solution: "Let $p$ = probability of at least one car in 5 minutes, so $1-p$ is the no-car probability. Over four independent 5-minute intervals, no car at all has probability $(1-p)^4$, and\n$$(1-p)^4 = 1 - \\frac{609}{625} = \\frac{16}{625} = \\Big(\\frac{2}{5}\\Big)^4.$$\nSo $1 - p = 2/5$, giving $p = \\frac{3}{5}$.",
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
                solution: "Let $X, Y \\sim U[0,60]$ independently. They meet iff $|X - Y| \\le 5$ — a band around the diagonal of the $60\\times60$ square. The non-meeting region is two corner triangles, each with legs $55$:\n$$P(\\text{meet}) = \\frac{60^2 - 2\\cdot\\tfrac{1}{2}(55^2)}{60^2} = \\frac{3600 - 3025}{3600} = \\frac{575}{3600} \\cdot \\ldots = \\frac{23}{144}.$$\n(Equivalently $1 - (55/60)^2 = 1 - 121/144 = 23/144$.)",
                keyIdea: "Geometric probability: map the joint uniform pair to area in a square; the meeting band's area over the total gives the probability."
              },
              {
                title: "Probability of Triangle",
                difficulty: "hard",
                tags: ["geometric probability", "uniform"],
                statement: "A stick of length 1 is cut at two independent uniformly random points. What is the probability the three pieces can form a triangle?",
                hint: "Let the cut points be $x$ and $y$; the three pieces form a triangle iff no piece exceeds $1/2$.",
                solution: "Let the cuts be at $x, y \\sim U[0,1]$. The pieces form a triangle iff each piece $< 1/2$ (triangle inequality). Working in the unit square of $(x,y)$ and splitting into the cases $x<y$ and $x>y$, the feasible region is two small triangles whose total area is $\\tfrac14$ of the square. So\n$$P(\\text{triangle}) = \\frac{1}{4}.$$",
                keyIdea: "Triangle inequality ⇔ every piece below $1/2$; the favorable set is $1/4$ of the $(x,y)$ unit square."
              },
              {
                title: "Property of Poisson Process",
                difficulty: "hard",
                tags: ["Poisson process", "memorylessness"],
                statement: "Buses arrive as a Poisson process with mean inter-arrival time 10 min ($\\lambda = 0.1$/min). You arrive at a random time. What is your expected waiting time for the next bus? On average, how long ago did the last bus leave?",
                hint: "Use the memorylessness of the exponential inter-arrival distribution.",
                solution: "Inter-arrival times are exponential with mean $1/\\lambda = 10$ min. By **memorylessness**, the time until the next bus — regardless of how long since the last — is still exponential with mean **10 minutes**. By the same symmetric argument, the time since the last bus also averages **10 minutes**.\n\nThis is the **inspection paradox**: the interval you land in averages $20$ minutes (not 10), because longer gaps are more likely to contain a random arrival. The expected residual life for a general distribution is $\\frac{E[X^2]}{2E[X]}$.",
                keyIdea: "Memorylessness makes forward and backward waiting times each ~10 min; the apparent contradiction (20-min straddled interval) is the inspection paradox."
              },
              {
                title: "Moments of Normal Distribution",
                difficulty: "hard",
                tags: ["normal distribution", "moment generating function"],
                statement: "If $X \\sim N(0,1)$, find $E[X^n]$ for $n = 1, 2, 3, 4$.",
                hint: "Odd moments vanish by symmetry. For even moments use the moment generating function $M(t) = e^{t^2/2}$.",
                solution: "By symmetry of the standard normal density, all **odd** moments are 0: $E[X] = E[X^3] = 0$.\n\nFor even moments, use $M(t) = E[e^{tX}] = e^{t^2/2}$ and the property $M^{(n)}(0) = E[X^n]$. Differentiating:\n- $M'(t) = t e^{t^2/2} \\Rightarrow E[X] = M'(0) = 0$,\n- $M''(0) = E[X^2] = 1$,\n- $M'''(0) = E[X^3] = 0$,\n- $M^{(4)}(0) = E[X^4] = 3$.\n\nSo the first four moments are $0, 1, 0, 3$ (mean 0, variance 1, zero skew, kurtosis 3).",
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
                solution: "With $n$ noodles there are $2n$ ends, i.e. $\\binom{2n}{2} = n(2n-1)$ equally likely first ties. Of these, $n$ ties join the two ends of the *same* noodle (forming a loop and leaving $n-1$ noodles). So\n$$E[f(n)] = \\frac{1}{2n-1} + E[f(n-1)],\\quad E[f(1)] = 1.$$\nUnrolling: $E[f(n)] = 1 + \\frac{1}{3} + \\frac{1}{5} + \\cdots + \\frac{1}{2n-1}$.\n\nFor 100 noodles: $E = \\sum_{k=1}^{100}\\frac{1}{2k-1} \\approx 3.28$.",
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
                solution: "For each of the 48 non-aces, let $X_i = 1$ if it appears before all 4 aces. By symmetry, among the 5 cards {that non-ace + 4 aces} it is equally likely to be in any of the 5 positions, so $P(X_i = 1) = 1/5$, i.e. $E[X_i] = 1/5$.\n\nCards turned to reach the first ace $= 1 + \\sum_{i=1}^{48} X_i$, so\n$$E = 1 + 48 \\cdot \\frac{1}{5} = 1 + 9.6 = 10.6.$$\n(General: first of $n$ special cards among $m$ ordinary appears at expected position $1 + \\frac{m}{n+1}$.)",
                keyIdea: "Indicator variables + symmetry: each non-ace precedes all aces with probability $1/5$; linearity of expectation finishes it without messy counting."
              },
              {
                title: "Sum of Random Variables",
                difficulty: "hard",
                tags: ["uniform", "induction", "geometry"],
                statement: "$X_1, X_2, \\dots$ are i.i.d. $U[0,1]$. What is the probability that $S_n = X_1 + \\cdots + X_n \\le 1$?",
                hint: "It's the volume of an $n$-dimensional simplex. Try $n=2,3$, find the pattern, prove by induction.",
                solution: "$P(S_n \\le 1)$ is the volume of the region $\\{x_i \\ge 0, \\sum x_i \\le 1\\}$ — the standard $n$-simplex inside the unit cube. For $n=2$ it's a triangle of area $1/2$; for $n=3$ a tetrahedron of volume $1/6$. The pattern:\n$$P(S_n \\le 1) = \\frac{1}{n!}.$$\nProve by induction conditioning on $X_{n+1}$: $P(S_{n+1}\\le 1) = \\int_0^1 P(S_n \\le 1 - x)\\,dx = \\int_0^1 \\frac{(1-x)^n}{n!}\\,dx = \\frac{1}{(n+1)!}$.",
                keyIdea: "The event is the volume of a simplex; conditioning on the last variable gives the clean induction $\\frac{1}{n!} \\to \\frac{1}{(n+1)!}$."
              },
              {
                title: "Coupon Collection",
                difficulty: "medium",
                tags: ["geometric distribution", "expectation"],
                statement: "There are $N$ distinct coupon types, each equally likely per box. Part A: expected number of coupons to collect a complete set? Part B: among $n$ collected coupons, the expected number of **distinct** types?",
                hint: "Part A: after collecting $i-1$ types, the wait for a new type is geometric. Part B: use an indicator for each type.",
                solution: "**Part A.** Let $X_i$ be the number of coupons to get the $i$-th *new* type after having $i-1$. A new type appears with prob $\\frac{N-i+1}{N}$, so $X_i$ is geometric with mean $\\frac{N}{N-i+1}$. Thus\n$$E[X] = \\sum_{i=1}^N \\frac{N}{N-i+1} = N\\Big(1 + \\tfrac{1}{2} + \\cdots + \\tfrac{1}{N}\\Big) \\approx N\\ln N.$$\n\n**Part B.** For each type $i$, indicator $I_i = 1$ if type $i$ appears among $n$ coupons. $P(I_i = 1) = 1 - \\big(\\tfrac{N-1}{N}\\big)^n$, so the expected number of distinct types is\n$$E[Y] = N\\Big(1 - \\big(\\tfrac{N-1}{N}\\big)^n\\Big).$$",
                keyIdea: "Part A: sum of geometrics → harmonic number ($N\\ln N$). Part B: indicators + linearity, with each type missing with prob $((N-1)/N)^n$."
              },
              {
                title: "Joint Default Probability",
                difficulty: "hard",
                tags: ["covariance", "correlation", "bounds"],
                statement: "Bond A defaults next year with prob 50%, bond B with 30%, and their default correlation is 0.3. What is the probability that **at least one** defaults? And what is the range of possible correlations?",
                hint: "Write $P(A \\text{ or } B) = P(A) + P(B) - P(AB)$ and express $P(AB)$ via covariance of the default indicators.",
                solution: "Let $I_A, I_B$ be default indicators: $E[I_A]=0.5$, $E[I_B]=0.3$, $\\mathrm{Var}(I_A)=0.25$, $\\mathrm{Var}(I_B)=0.21$. Covariance:\n$$\\mathrm{Cov} = \\rho\\sqrt{\\mathrm{Var}(I_A)\\mathrm{Var}(I_B)} = 0.3\\sqrt{0.25\\cdot 0.21} = 0.3\\sqrt{0.0525} \\approx 0.0687.$$\nThen $P(AB) = \\mathrm{Cov} + E[I_A]E[I_B] = 0.0687 + 0.15 = 0.2187$, so\n$$P(A \\text{ or } B) = 0.5 + 0.3 - 0.2187 \\approx 0.581.$$\nThe correlation itself is bounded: feasible $P(AB)$ ranges constrain $\\rho \\in [-\\sqrt{3/7}, \\sqrt{3/7}] \\approx [-0.655, 0.655]$.",
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
                solution: "For $U[0,1]$, $F(x) = x$. The max has cdf $F_Z(x) = x^n$, density $f_Z(x) = nx^{n-1}$:\n$$E[Z] = \\int_0^1 x\\cdot nx^{n-1}\\,dx = \\frac{n}{n+1}.$$\nThe min has cdf $1-(1-x)^n$, density $n(1-x)^{n-1}$:\n$$E[W] = \\int_0^1 x\\cdot n(1-x)^{n-1}\\,dx = \\frac{1}{n+1}.$$\nNeatly, the $n$ order statistics partition $[0,1]$ into $n+1$ equal expected gaps of $\\frac{1}{n+1}$.",
                keyIdea: "Max cdf is $F^n$, min cdf is $1-(1-F)^n$; for the uniform the expectations are $\\frac{n}{n+1}$ and $\\frac{1}{n+1}$."
              },
              {
                title: "Correlation of Max and Min",
                difficulty: "hard",
                tags: ["order statistics", "covariance", "correlation"],
                statement: "$X_1, X_2$ i.i.d. $U[0,1]$. Let $Y = \\min(X_1,X_2)$ and $Z = \\max(X_1,X_2)$. What is the correlation of $Y$ and $Z$?",
                hint: "Get the marginal densities of $Y$ and $Z$ for $n=2$, then compute $E[YZ]$ using $YZ = X_1 X_2$.",
                solution: "For $n=2$: $f_Y(y) = 2(1-y)$, $f_Z(z) = 2z$. So $E[Y] = 1/3$, $E[Z] = 2/3$, and\n$$E[Y^2] = \\int_0^1 y^2\\cdot 2(1-y)\\,dy = \\tfrac{1}{6},\\quad \\mathrm{Var}(Y) = \\tfrac16 - \\tfrac19 = \\tfrac{1}{18};$$\n$$E[Z^2] = \\int_0^1 z^2\\cdot 2z\\,dz = \\tfrac12,\\quad \\mathrm{Var}(Z) = \\tfrac12 - \\tfrac49 = \\tfrac{1}{18}.$$\nSince $YZ = \\min\\cdot\\max = X_1 X_2$, $E[YZ] = E[X_1]E[X_2] = \\tfrac12\\cdot\\tfrac12 = \\tfrac14$. Then $\\mathrm{Cov}(Y,Z) = \\tfrac14 - \\tfrac13\\cdot\\tfrac23 = \\tfrac{1}{36}$, so\n$$\\mathrm{corr}(Y,Z) = \\frac{1/36}{\\sqrt{(1/18)(1/18)}} = \\frac{1}{2}.$$",
                keyIdea: "Use $\\min\\cdot\\max = X_1X_2$ to get $E[YZ]$ for free; the positive correlation ($1/2$) reflects that a large min forces a large max."
              },
              {
                title: "Random Ants",
                difficulty: "hard",
                tags: ["symmetry", "order statistics", "expectation"],
                statement: "500 ants are placed uniformly at random on a 1-foot string, each facing a random direction, all moving at 1 ft/min. Colliding ants instantly reverse direction. What is the expected time for all ants to fall off the string?",
                hint: "When two ants collide and reverse, it's the same as if they passed through each other — just swap labels.",
                solution: "**Key trick:** two ants colliding and reversing is indistinguishable from them **passing through** each other (just relabel them). So collisions can be ignored — each ant effectively walks straight at 1 ft/min until it falls off.\n\nAn ant at position $x$ facing one end falls off in $x$ minutes (or $1-x$ the other way); by symmetry the random direction makes the fall-off time for a given ant equivalent to traveling the longer distance. The time for **all** ants to fall off equals the **maximum** travel time, which equals the expected maximum of 500 i.i.d. $U[0,1]$ distances:\n$$E[\\text{time}] = \\frac{500}{500+1} = \\frac{500}{501} \\approx 0.998 \\text{ min}.$$",
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
                solution: "Track only M's money $m \\in \\{0,1,2,3\\}$; states 0 and 3 are absorbing. From an interior state, M moves up with prob $2/3$, down with $1/3$. Let $a_m$ be the probability M eventually reaches \\$3 from state $m$, with $a_0 = 0$, $a_3 = 1$:\n$$a_1 = \\tfrac{1}{3}a_0 + \\tfrac{2}{3}a_2, \\qquad a_2 = \\tfrac{1}{3}a_1 + \\tfrac{2}{3}a_3.$$\nSolving: $a_1 = 4/7$, $a_2 = 6/7$. M starts with \\$1, so M wins with probability **$4/7$**.",
                keyIdea: "Reduce the 2-D money state to 1-D (M's holdings sum to a constant), then solve linear absorption equations with the two boundary conditions."
              },
              {
                title: "Dice Question",
                difficulty: "medium",
                tags: ["Markov chain", "conditional probability"],
                statement: "Two players roll two dice repeatedly. Player A bets a sum of **12** will appear before two consecutive **7s**; player B bets two consecutive 7s come first. What is the probability A wins?",
                hint: "Condition on the first roll's sum (12, 7, or other). 'Two consecutive 7s' needs a state tracking 'last roll was a 7'.",
                solution: "Let $P(A)$ be A's win probability. $P(\\text{sum}=12) = 1/36$, $P(\\text{sum}=7) = 6/36$, $P(\\text{other}) = 29/36$. Condition on the first roll:\n- sum 12 → A wins immediately.\n- other → game restarts: contributes $P(A)$.\n- sum 7 → need a second roll: if next is 12, A wins; if next is 7, B wins; otherwise restart.\n\nWorking through the conditional equation\n$$P(A) = \\tfrac{1}{36} + \\tfrac{29}{36}P(A) + \\tfrac{6}{36}\\big[\\tfrac{1}{36} + \\tfrac{29}{36}P(A)\\big]$$\nand solving gives $P(A) = \\dfrac{7}{13}$.",
                keyIdea: "Consolidate equivalent positions into a few states ('start' vs 'just rolled a 7'); set up a self-referential equation and solve."
              },
              {
                title: "Coin Triplets",
                difficulty: "hard",
                tags: ["Markov chain", "expected value", "non-transitive"],
                statement: "Part A: Expected number of fair-coin tosses to first see **HHH** in a row? And to first see **THH**? Part B: Probability that **HHH** occurs before **THH** in the sequence? Part C: In a game where each player picks a triplet and the first to appear wins, would you go first or second?",
                hint: "Build a Markov chain over the 'progress so far' states (S, H, HH, HHH). For Part B/C think about what must precede HHH.",
                solution: "**Part A.** States by current progress. Solving the expected-absorption equations:\n- $E[\\text{tosses to HHH}] = 14$.\n- $E[\\text{tosses to THH}] = 8$.\n\n(THH is faster because once you have an HH, a leading T is easy to come by, whereas HHH has no 'recovery'.)\n\n**Part B.** $P(\\text{HHH before THH}) = \\dfrac{1}{8}$. Reason: the only way to reach HHH first is to get HHH right at the very start (probability $(1/2)^3 = 1/8$); otherwise a $T$ appears before the three $H$s, which sets up THH first.\n\n**Part C.** This triplet game is **non-transitive** — there is no single best triplet. Whatever the first player announces, the second player can always pick a triplet that beats it with probability > 1/2 (choose your first two coins to be the last two of the opponent's sequence). **Go second** — you can always get ≥ 2/3 odds.",
                keyIdea: "Markov-chain absorption gives the expected waiting times; the non-transitivity (like Penney's game) means the second mover always has an edge."
              },
              {
                title: "Color Balls",
                difficulty: "hard",
                tags: ["Markov chain", "symmetry", "expected value"],
                statement: "A box has $n$ balls of $n$ different colors. Repeatedly pick a random pair, repaint the first to match the second, and return both. What is the expected number of steps until all balls are the same color?",
                hint: "By symmetry, condition on the final color being color 1, and track only the count of color-1 balls as a Markov chain.",
                solution: "By color symmetry, assume the absorbing color is color 1 and track $c$ = the number of color-1 balls (states $0,\\dots,n$; only $n$ is absorbing). From state $c$, the count goes up by 1 with probability $\\frac{c(n-c)}{n(n-1)}$ (pick a color-1 ball as the 'model' and a non-color-1 ball to repaint), down by 1 with the same probability, and stays otherwise — a symmetric birth–death chain. Solving the expected-absorption system with boundary $Z_n = 0$ gives\n$$E[\\text{steps}] = (n-1)^2.$$",
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
                solution: "Set the start at 17, boundaries 0 and 100. Since $S_n$ is a martingale, optional stopping gives $E[S_N] = 17$. If $p$ is the probability of reaching 100:\n$$100p + 0(1-p) = 17 \\Rightarrow p = 0.17.$$\nSince $S_n^2 - n$ is also a martingale, $E[S_N^2] = E[N] + 17^2$. With $E[S_N^2] = 100^2 \\cdot 0.17$:\n$$E[N] = 100^2(0.17) - 17^2 = 1700 - 289 = 1441 \\text{ steps}.$$\n(General symmetric walk reaching $\\alpha$ or $-\\beta$: $p_\\alpha = \\frac{\\beta}{\\alpha+\\beta}$, $E[N] = \\alpha\\beta$.)",
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
                solution: "**Definition.** $W(t)$ is a Brownian motion if: (1) $W(0) = 0$; (2) increments over disjoint intervals are independent; (3) $W(t)-W(s) \\sim N(0, t-s)$; (with continuous paths). Properties: $E[W(t)] = 0$, $E[W(t)^2] = t$, it's a **martingale**, $\\mathrm{Cov}(W(s),W(t)) = \\min(s,t)$, and the Markov property holds. Also $W(t)^2 - t$ and $\\exp(\\lambda W(t) - \\tfrac12\\lambda^2 t)$ are martingales.\n\n**Correlation of $B_t$ and $B_t^2$:** since $B_t \\sim N(0,t)$ is symmetric, $E[B_t^3] = 0$ and $E[B_t] = 0$, so $\\mathrm{Cov}(B_t, B_t^2) = E[B_t^3] - E[B_t]E[B_t^2] = 0$. **Correlation is 0** (uncorrelated, though not independent).\n\n**$P(B_1 > 0, B_2 < 0)$:** write $B_2 = B_1 + (B_2 - B_1)$ with the increment independent of $B_1$. By the symmetry of the joint density (8 symmetric regions), the answer is\n$$P(B_1 > 0, B_2 < 0) = \\tfrac{1}{2}P(B_2 - B_1 < -B_1 \\mid B_1>0)\\cdots = \\frac{1}{8}.$$",
                keyIdea: "Symmetry kills odd moments (giving zero correlation); independent increments + symmetry partition the plane into 8 equal-probability regions, so the joint-sign probability is 1/8."
              },
              {
                title: "Stopping Time / First Passage Time",
                difficulty: "hard",
                tags: ["stopping time", "martingale", "reflection"],
                statement: "Part A: Mean stopping time for a Brownian motion to first reach +1 or −1? Part B: For first passage to level $x>0$, what is the density of the passage time $\\tau_x$ and its expected value? Part C: $dX = dW$; if $X$ starts at 0, what is the probability it hits 3 before −5?",
                hint: "$B_t^2 - t$ is a martingale (Part A). For Part C, use that $B_t$ is a martingale and apply optional stopping; the exponential martingale gives passage probabilities.",
                solution: "**Part A.** $B_t^2 - t$ is a martingale, so $E[B_T^2 - T] = 0$. At stopping, $B_T^2 = 1$, hence $E[T] = E[B_T^2] = 1$.\n\n**Part B.** By the reflection principle, $P(\\tau_x \\le t) = 2P(W(t) \\ge x) = 2\\big(1 - N(x/\\sqrt t)\\big)$. Differentiating gives the density\n$$f_{\\tau_x}(t) = \\frac{x}{t^{3/2}\\sqrt{2\\pi}}e^{-x^2/(2t)}.$$\nThe expected passage time $E[\\tau_x] = \\infty$ (the density has a heavy tail) even though $P(\\tau_x < \\infty) = 1$.\n\n**Part C.** $X = B$ is a martingale; by optional stopping at boundaries $+3$ and $-5$, $E[X_T] = 0$:\n$$3\\,p + (-5)(1-p) = 0 \\Rightarrow p = \\frac{5}{8}.$$",
                keyIdea: "$B_t^2 - t$ gives expected hitting times; the reflection principle gives the first-passage density; optional stopping of $B_t$ itself gives boundary-hitting probabilities $\\frac{\\beta}{\\alpha+\\beta}$."
              },
              {
                title: "Itô's Lemma",
                difficulty: "hard",
                tags: ["Ito's lemma", "martingale"],
                statement: "Itô's lemma: $df = \\big(\\partial_t f + \\mu\\,\\partial_x f + \\tfrac12\\sigma^2 \\partial_{xx} f\\big)dt + \\sigma\\,\\partial_x f\\,dW$. Use it: (A) Is $Z_t = \\sqrt{t}\\,B_t$ a martingale? (B) Is $W(t)^3$ a martingale?",
                hint: "A process is a martingale iff its drift (the $dt$ coefficient) is zero. Apply Itô's lemma and inspect the drift.",
                solution: "A process is a martingale **iff its drift term ($dt$ coefficient) is identically zero**.\n\n**(A) $Z_t = \\sqrt t\\,B_t$.** Apply Itô with $f(B_t, t) = \\sqrt t\\, B_t$: $\\partial_t f = \\tfrac{1}{2}t^{-1/2}B_t$, $\\partial_B f = \\sqrt t$, $\\partial_{BB} f = 0$. So\n$$dZ_t = \\tfrac{1}{2}t^{-1/2}B_t\\,dt + \\sqrt t\\,dB_t.$$\nThe drift $\\tfrac{1}{2}t^{-1/2}B_t \\ne 0$ (whenever $B_t \\ne 0$, probability 1). **Not a martingale.**\n\n**(B) $W(t)^3$.** With $f = W^3$: $\\partial_t f = 0$, $\\partial_W f = 3W^2$, $\\partial_{WW} f = 6W$. So\n$$df = \\tfrac12(6W)\\,dt + 3W^2\\,dW = 3W\\,dt + 3W^2\\,dW.$$\nThe drift $3W(t) \\ne 0$ (prob 1). **Not a martingale.**",
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
          { id: "6.1", title: "Option Pricing", problems: [ph("Price direction of options"), ph("Put-call parity"), ph("American vs. European options"), ph("Black-Scholes-Merton differential equation"), ph("Black-Scholes formula")] },
          { id: "6.2", title: "The Greeks", problems: [ph("Delta"), ph("Gamma"), ph("Theta"), ph("Vega")] },
          { id: "6.3", title: "Option Portfolios & Exotic Options", problems: [ph("Bull spread"), ph("Straddle"), ph("Binary options"), ph("Exchange options")] },
          { id: "6.4", title: "Other Finance Questions", problems: [ph("Portfolio optimization"), ph("Value at risk"), ph("Duration and convexity"), ph("Forward and futures"), ph("Interest rate models")] }
        ]
      },
      {
        num: 7,
        title: "Algorithms & Numerical Methods",
        blurb: "Classic algorithms, bit tricks (the power of two), and numerical methods like Monte Carlo and finite differences.",
        topics: [
          { id: "7.1", title: "Algorithms", problems: [ph("Number swap"), ph("Unique elements"), ph("Horner's algorithm"), ph("Moving average"), ph("Sorting algorithm"), ph("Random permutation"), ph("Search algorithm"), ph("Fibonacci numbers"), ph("Maximum contiguous subarray")] },
          { id: "7.2", title: "The Power of Two", problems: [ph("Power of 2?"), ph("Multiplication by 7"), ph("Probability simulation"), ph("Poisonous wine")] },
          { id: "7.3", title: "Numerical Methods", problems: [ph("Monte Carlo simulation"), ph("Finite difference method")] }
        ]
      }
    ]
  };
})();
