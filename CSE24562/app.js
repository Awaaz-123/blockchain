/* -------------------------------------------------------------
 * Consensus Algorithms in Blockchain — A Comparative Explorer
 * Application Logic & Data Structures (ES6 Javascript)
 * ------------------------------------------------------------- */

// Global State
let currentAlgoId = 'pos'; // Default selection
let activeMatrixPair = { row: null, col: null }; // Tracker for clicked cell in the matrix

// 1. DATASET: Consensus Algorithms
const CON_ALGORITHMS = {
    pow: {
        id: 'pow',
        name: 'Proof of Work',
        short: 'PoW',
        type: 'Layer 1 Base Protocol',
        icon: 'fa-solid fa-fire-flame-curved',
        color: 'var(--color-pow)',
        description: 'The pioneering blockchain consensus mechanism. Nodes (miners) compete to solve complex cryptographic puzzles using computational hashing power. The first miner to find the valid solution (nonce) earns the right to broadcast the new block and receive the block reward. This creates high security through physical energy expenditure.',
        steps: [
            {
                title: 'Transaction Initiation',
                desc: 'Users sign transactions with private keys and broadcast them to the peer-to-peer network.'
            },
            {
                title: 'Mempool Assembly',
                desc: 'Nodes collect pending transactions into a local buffer called the memory pool (mempool).'
            },
            {
                title: 'Cryptographic Competition',
                desc: 'Miners continuously hash the block header plus a random "nonce" until they find a hash value below the target difficulty threshold (SHA-256).'
            },
            {
                title: 'Block Broadcast & Validation',
                desc: 'The winning miner propagates the new block. Other nodes quickly verify the hash math. If valid, they add it to their ledger copy.'
            },
            {
                title: 'Longest Chain Settlement',
                desc: 'Security settles probabilistically. The chain with the most cumulative Proof of Work (longest chain) is accepted as the canonical truth.'
            }
        ],
        trilemma: {
            decentralization: {
                score: 85,
                desc: 'Highly decentralized at the protocol level as anyone can participate. However, industrial ASIC mining pools can centralize hash control.'
            },
            security: {
                score: 95,
                desc: 'Incredibly secure once hash rate is high. Overthrowing Bitcoin requires a 51% attack, requiring billions in hardware and electricity.'
            },
            scalability: {
                score: 15,
                desc: 'Poor throughput and high latency. Strict difficulty adjustments limit Bitcoin to ~7-10 TPS and 10-minute block times to prevent forks.'
            }
        },
        tps: '~7 - 15 TPS',
        blockTime: '10 Minutes'
    },
    pos: {
        id: 'pos',
        name: 'Proof of Stake',
        short: 'PoS',
        type: 'Layer 1 Base Protocol',
        icon: 'fa-solid fa-server',
        color: 'var(--color-pos)',
        description: 'Stakers replace miners. Rather than burning electricity, validators lock up native tokens (stake) in a smart contract as collateral. The protocol randomly selects validators to propose and attest to new blocks based on their stake size. Dishonest behavior triggers "slashing" (confiscation of staked assets), aligning validator incentives mathematically.',
        steps: [
            {
                title: 'Collateral Deposited',
                desc: 'Participants deposit native tokens (e.g., 32 ETH) into the consensus contract to activate their validator node.'
            },
            {
                title: 'Validator Selection',
                desc: 'The pseudo-random consensus engine selects a proposer for the current slot based on stake size and historical age.'
            },
            {
                title: 'Block Proposal',
                desc: 'The selected validator packages transactions, executes state changes, and broadcasts the proposed block.'
            },
            {
                title: 'Attestation & Voting',
                desc: 'A committee of other validators signs off (attests) that the proposed block is valid and mathematically correct.'
            },
            {
                title: 'Finalization (Casper FFG)',
                desc: 'Once two-thirds of the validator network attests to a checkpoint, the block achieves absolute finality, making reversion impossible.'
            }
        ],
        trilemma: {
            decentralization: {
                score: 80,
                desc: 'Low barrier to entry relative to mining hardware, but liquid staking pools (like Lido) and massive capital holders can centralize consensus power.'
            },
            security: {
                score: 90,
                desc: 'High economic security. A 51% attack requires buying 51% of all staked tokens. Slashing rules permanently burn the attacker\'s stake.'
            },
            scalability: {
                score: 55,
                desc: 'Moderate scalability. Slot intervals are structured (Ethereum: 12 seconds), offering faster throughput (~15-30 TPS base, scaling higher via rollups).'
            }
        },
        tps: '~30 - 250 TPS',
        blockTime: '12 - 20 Seconds'
    },
    dpos: {
        id: 'dpos',
        name: 'Delegated Proof of Stake',
        short: 'DPoS',
        type: 'Layer 1 Base Protocol',
        icon: 'fa-solid fa-users-gear',
        color: 'var(--color-dpos)',
        description: 'An industrial scaling variant of PoS. Token holders delegate their voting weight to elect a limited pool of professional nodes (delegates or witnesses) who are solely responsible for generating blocks. By reducing the validator set to a small, high-performance group (e.g., 21 nodes), the network achieves ultra-fast finality and high TPS at the cost of decentralization.',
        steps: [
            {
                title: 'Representative Election',
                desc: 'Token holders vote for their preferred delegates. Voting weight is directly proportional to the number of tokens held.'
            },
            {
                title: 'Delegate Rotation',
                desc: 'The top voted delegates (e.g., 21 on EOS, 26 on BNB) are selected to enter the active block production schedule.'
            },
            {
                title: 'Sequential Production',
                desc: 'Active delegates produce blocks in a round-robin sequence. If a delegate misses a block, they are penalized or voted out.'
            },
            {
                title: 'Immediate Finality',
                desc: 'With a minimal validator set, block attestations propagate in milliseconds, leading to rapid consensus agreement.'
            }
        ],
        trilemma: {
            decentralization: {
                score: 35,
                desc: 'Low decentralization. Oligarchical structures can form where a few massive delegates collude to maintain their highly profitable seats.'
            },
            security: {
                score: 75,
                desc: 'Vulnerable to collusion and social engineering attacks on elected delegates. However, the community can dynamically vote out malicious nodes.'
            },
            scalability: {
                score: 85,
                desc: 'Superb throughput. Minimal network latency allows block production times of 3 seconds or less and handles thousands of transactions.'
            }
        },
        tps: '2,000+ TPS',
        blockTime: '3 Seconds'
    },
    poh: {
        id: 'poh',
        name: 'Proof of History',
        short: 'PoH',
        type: 'Hybrid Consensus Mechanism',
        icon: 'fa-solid fa-hourglass-half',
        color: 'var(--color-poh)',
        description: 'A cryptographic clock that integrates time directly into the ledger. Using a sequential Verifiable Delay Function (VDF), PoH proves that an event occurred at a specific point in time without nodes needing to talk to one another. Combined with Tower BFT (a PoS variant), this lets Solana process transactions asynchronously, producing sub-second finality.',
        steps: [
            {
                title: 'VDF Hashing',
                desc: 'The leader node runs a sequential SHA-256 loop, creating a verifiable timestamp output representing the passage of ticks.'
            },
            {
                title: 'Data Integration',
                desc: 'Incoming transactions are hashed directly into the active clock ticks, proving the exact sequence of arrival.'
            },
            {
                title: 'Parallel Validation',
                desc: 'Other nodes verify the mathematical clock ticks in parallel, confirming transaction sequence without waiting for peer network sync.'
            },
            {
                title: 'Tower BFT Vote',
                desc: 'Validators lock stakes to vote on the validity of the sequence. If verified, blocks achieve sub-second deterministic finality.'
            }
        ],
        trilemma: {
            decentralization: {
                score: 50,
                desc: 'Low-to-moderate decentralization. High computational overhead and specialized hardware (high-end CPUs/GPUs) restrict validation node counts.'
            },
            security: {
                score: 80,
                desc: 'Strong security combining cryptographic timestamping and validator staking. Vulnerable to network partition or leader outage issues.'
            },
            scalability: {
                score: 95,
                desc: 'Unmatched L1 throughput. Generates sub-second block times and processes up to 65,000 theoretical transactions per second.'
            }
        },
        tps: '50,000+ TPS',
        blockTime: '400 Milliseconds'
    },
    bft: {
        id: 'bft',
        name: 'Practical Byzantine Fault Tolerance',
        short: 'PBFT',
        type: 'Consortium / Layer 1 Protocol',
        icon: 'fa-solid fa-chess-knight',
        color: 'var(--color-bft)',
        description: 'A classic computer science solution for consensus in distributed networks. Nodes participate in multiple rounds of voting to achieve absolute agreement before writing a block. PBFT guarantees consensus if fewer than 1/3 of the nodes are malicious. Modern blockchains like Cosmos use Tendermint BFT to achieve instant finality with fixed validator sets.',
        steps: [
            {
                title: 'Request / Proposal',
                desc: 'A leader node proposes the next block containing ordered transactions to the validator group.'
            },
            {
                title: 'Pre-Vote Round',
                desc: 'Validators inspect the proposed block and broadcast a pre-vote to all other nodes indicating whether they agree.'
            },
            {
                title: 'Pre-Commit Round',
                desc: 'Once a node receives 2/3 pre-votes, it broadcasts a pre-commit vote, signaling readiness to write to the ledger.'
            },
            {
                title: 'Commit / Finalization',
                desc: 'Upon receiving 2/3 pre-commits, nodes permanently commit the block. The ledger is final immediately; no forks can occur.'
            }
        ],
        trilemma: {
            decentralization: {
                score: 45,
                desc: 'Requires a fixed, curated validator set. Communication complexity scales quadratically (O(N²)), limiting active nodes to a few hundred.'
            },
            security: {
                score: 85,
                desc: 'Mathematically robust. Cannot fork under normal circumstances. Can withstand up to 33% malicious colluders.'
            },
            scalability: {
                score: 75,
                desc: 'High speed and low latency. Instant finality protects trades from reorganization. Throughput easily crosses 10,000 TPS.'
            }
        },
        tps: '10,000+ TPS',
        blockTime: '1 - 5 Seconds'
    },
    poa: {
        id: 'poa',
        name: 'Proof of Authority',
        short: 'PoA',
        type: 'Permissioned / Hybrid Protocol',
        icon: 'fa-solid fa-circle-check',
        color: 'var(--color-poa)',
        description: 'A reputation-based consensus model. Instead of putting up monetary stake, validators stake their real-world identity. Validators undergo thorough background checks and are approved by the network authority. Because nodes are known and trusted, block production is highly optimized, requiring zero computational competition and minimal validation loops.',
        steps: [
            {
                title: 'Identity Verification',
                desc: 'Potential validator nodes undergo formal identity verification and secure regulatory approval to join.'
            },
            {
                title: 'Authority Rotation',
                desc: 'The network rotated block-proposing duties among active authority nodes in a fixed scheduling loop.'
            },
            {
                title: 'Zero-Competition Block Production',
                desc: 'The scheduled authority generates the block instantly. No mathematical puzzles are solved; no stakes are weighed.'
            },
            {
                title: 'Signature Verification',
                desc: 'Remaining authorities verify the signature of the block proposer. The block is added to the ledger instantly.'
            }
        ],
        trilemma: {
            decentralization: {
                score: 10,
                desc: 'Extremely centralized. The network is operated by a tiny consortium of pre-approved identities, making it permissioned.'
            },
            security: {
                score: 65,
                desc: 'Vulnerable to corruption or compromise of the primary validator identities. Protected by legal and reputational incentives.'
            },
            scalability: {
                score: 90,
                desc: 'Optimized for raw speed. Runs on dedicated hardware with trusted communication channels, reaching massive transaction rates.'
            }
        },
        tps: '10,000+ TPS',
    },
    poet: {
        id: 'poet',
        name: 'Proof of Elapsed Time',
        short: 'PoET',
        type: 'Permissioned / Consortium Protocol',
        icon: 'fa-solid fa-stopwatch',
        color: 'var(--color-poet)',
        description: 'A hardware-based consensus mechanism developed by Intel. Instead of competing computationally (like PoW) or staking capital (like PoS), nodes request a secure wait time from a Trusted Execution Environment (TEE), such as Intel SGX. The node with the shortest randomly generated timer wakes up first to propose the next block, achieving high efficiency and fair distribution with minimal energy consumption.',
        steps: [
            {
                title: 'Enclave Registration',
                desc: 'Nodes register their hardware-certified Trusted Execution Environment (TEE) enclaves with the network to verify they are running authentic, tamper-proof PoET code.'
            },
            {
                title: 'Wait Time Generation',
                desc: 'Each node requests a trusted random wait timer from their local secure enclave. The enclave signs and seals the timer value.'
            },
            {
                title: 'Enclave Sleeping State',
                desc: 'Nodes enter a sleeping state, waiting for their respective timers to count down. This minimizes active CPU cycles and power draw.'
            },
            {
                title: 'Shortest Timer Wake-up',
                desc: 'The node whose timer expires first wakes up, creates a block proposal, and attaches a cryptographic proof from the enclave validating the wait time.'
            },
            {
                title: 'Attestation & Block Commit',
                desc: 'Other nodes verify the enclave\'s cryptographic signature and wait-time proof. If valid, the block is committed to the blockchain instantly.'
            }
        ],
        trilemma: {
            decentralization: {
                score: 30,
                desc: 'Relies heavily on hardware attestation from specific CPU manufacturers (e.g. Intel SGX), creating vendor lock-in and hardware centralization.'
            },
            security: {
                score: 75,
                desc: 'Highly resilient against Sybil and 51% attacks through enclave-level limits, but exposed to side-channel CPU vulnerabilities or TEE exploits.'
            },
            scalability: {
                score: 80,
                desc: 'Extremely efficient execution. Sleep states keep node resource demands minimal, supporting rapid block times (~5s) and a scale of 1,000+ TPS.'
            }
        },
        tps: '1,000+ TPS',
        blockTime: '5 - 10 Seconds'
    }
};

// 2. DATASET: Blockchains Mapped to Consensus
const BLOCKCHAINS = [
    {
        id: 'btc',
        name: 'Bitcoin',
        ticker: 'BTC',
        algoId: 'pow',
        layer: 'Layer 1 (Base Chain)',
        reason: 'Bitcoin prioritizes absolute decentralization and security over speed to serve as a sovereign, censorship-resistant digital gold store.',
        languages: ['Script'],
        logoLetter: '₿',
        color: '#f7931a'
    },
    {
        id: 'eth',
        name: 'Ethereum',
        ticker: 'ETH',
        algoId: 'pos',
        layer: 'Layer 1 (Base Chain)',
        reason: 'Switched from PoW to PoS ("The Merge") to slash network energy usage by 99.9%, introduce staking slashing penalties, and prepare for L2 scaling.',
        languages: ['Solidity', 'Vyper'],
        logoLetter: 'Ξ',
        color: '#627eea'
    },
    {
        id: 'sol',
        name: 'Solana',
        ticker: 'SOL',
        algoId: 'poh',
        layer: 'Layer 1 (Base Chain)',
        reason: 'Uses PoH and Tower BFT to create a centralized virtual clock, enabling high-performance parallel execution of smart contracts with minimal fees.',
        languages: ['Rust', 'C', 'C++'],
        logoLetter: 'S',
        color: '#14f195'
    },
    {
        id: 'ada',
        name: 'Cardano',
        ticker: 'ADA',
        algoId: 'pos',
        layer: 'Layer 1 (Base Chain)',
        reason: 'Employs Ouroboros (a mathematically proven secure PoS variant) which structures epochs and slots to guarantee security properties.',
        languages: ['Plutus', 'Haskell', 'Aiken'],
        logoLetter: 'A',
        color: '#0033ad'
    },
    {
        id: 'cosmos',
        name: 'Cosmos Hub',
        ticker: 'ATOM',
        algoId: 'bft',
        layer: 'Layer 1 (Hub Chain)',
        reason: 'Employs Tendermint Core (BFT) to enforce instant finality. This allows Cosmos Zones to link safely through the IBC protocol without fork risks.',
        languages: ['Go', 'Rust (CosmWasm)'],
        logoLetter: 'C',
        color: '#2e303f'
    },
    {
        id: 'bnb',
        name: 'BNB Chain',
        ticker: 'BNB',
        algoId: 'dpos',
        layer: 'Layer 1 (EVM-Compatible)',
        reason: 'Uses Proof of Staked Authority (PoSA - dynamic DPoS/PoA hybrid) with 26 validators to offer EVM compatibility with extremely cheap fees and high speeds.',
        languages: ['Solidity', 'Vyper'],
        logoLetter: 'B',
        color: '#f3ba2f'
    },
    {
        id: 'polkadot',
        name: 'Polkadot',
        ticker: 'DOT',
        algoId: 'pos',
        layer: 'Layer 0 (Relay Chain)',
        reason: 'Uses Nominated Proof of Stake (NPoS) where nominators back validators with capital, securing a unified state for independent parachains.',
        languages: ['Rust (Substrate)', 'ink!'],
        logoLetter: 'P',
        color: '#e6007a'
    },
    {
        id: 'polygon',
        name: 'Polygon PoS',
        ticker: 'POL',
        algoId: 'pos',
        layer: 'L1/L2 Hybrid Sidechain',
        reason: 'Operates as a PoS sidechain that checkpoints onto Ethereum L1. This allows developers to run standard EVM dApps with faster execution.',
        languages: ['Solidity', 'Vyper'],
        logoLetter: 'M',
        color: '#8247e5'
    },
    {
        id: 'arbitrum',
        name: 'Arbitrum One',
        ticker: 'ARB',
        algoId: 'poa', // Sequencer represents permissioned authority
        layer: 'Layer 2 (Optimistic Rollup)',
        reason: 'Relies on Ethereum L1 for decentralized security, but uses a high-performance permissioned Sequencer (PoA execution model) for fast L2 execution.',
        languages: ['Solidity', 'Vyper'],
    },
    {
        id: 'sawtooth',
        name: 'Hyperledger Sawtooth',
        ticker: 'SAW',
        algoId: 'poet',
        layer: 'Layer 1 (Enterprise/Permissioned)',
        reason: 'Uses PoET to achieve CPU-efficient, fair block selection in enterprise networks without mining hardware or massive token stakes.',
        languages: ['Python', 'Rust', 'Go', 'JavaScript'],
        logoLetter: 'H',
        color: '#06d6a0'
    }
];

// 3. DATASET: 2D Compatibility & Interoperability Details
const COMPATIBILITY_RULES = {
    // Shared consensus rules
    same_consensus: {
        status: 'Compatible',
        badgeClass: 'compat',
        rules: 'Shared Consensus Protocol',
        desc: 'These chains operate under the same consensus model. They share validation mathematics and state transition models, easing mutual verification.',
        bridge: 'Can use trustless light-client relays (like IBC) or validator-supported bridges. Light clients verify consensus proofs of the origin chain directly inside the destination chain.'
    },
    // Parent L1 / L2 Rollup relationship
    parent_l2: {
        status: 'Layer-Linked',
        badgeClass: 'compat',
        rules: 'Parent L1 & Scaling L2 Rollup',
        desc: 'This pairing represents a Layer 1 base chain and its native Layer 2 scaling solution. The L2 posts transaction rollups and proof roots to the L1, inheriting its base security.',
        bridge: 'Native Rollup Bridge. Standard bridge utilizes a challenge window (7 days for Optimistic Rollups) or zero-knowledge validity proofs (ZK Rollups) to achieve absolute security.'
    },
    // EVM execution environment compatibilities
    evm_compat: {
        status: 'EVM-Compatible',
        badgeClass: 'partial',
        rules: 'Different Consensus, Shared EVM Engine',
        desc: 'These networks utilize different consensus protocols (e.g., PoS vs DPoS/PoSA) but share the Ethereum Virtual Machine (EVM) standard. Smart contracts compiled to EVM bytecode can run on both networks.',
        bridge: 'Multi-chain messaging bridges (LayerZero, Axelar, Wormhole). Since contract formats are identical, message passing contracts can align states across chains.'
    },
    // Cross-Protocol Incompatibilities
    incompatible: {
        status: 'Incompatible',
        badgeClass: 'incompat',
        rules: 'Incompatible Consensus Rules',
        desc: 'These chains utilize fundamentally different consensus architectures (e.g., PoW vs PoH). One cannot directly verify the block proofs of the other in a native manner.',
        bridge: 'Requires wrapped assets (wBTC), centralized custodial bridges, or complex multi-signature threshold cryptography bridges (like tBTC).'
    }
};

// Generates the rule key for any pair of blockchains
function getCompatibilityType(chainA, chainB) {
    if (chainA.id === chainB.id) {
        return { type: 'same_consensus', notes: 'Identical blockchain. Full state convergence.' };
    }
    
    // Check L1 -> L2 relation
    if ((chainA.id === 'eth' && chainB.id === 'arbitrum') || (chainB.id === 'eth' && chainA.id === 'arbitrum')) {
        return { 
            type: 'parent_l2', 
            notes: 'Arbitrum settles transactions directly on Ethereum L1, inheriting its PoS validator security.' 
        };
    }
    
    // Check if they use the same consensus mechanism ID
    if (chainA.algoId === chainB.algoId) {
        return { 
            type: 'same_consensus', 
            notes: `Both networks operate on ${CON_ALGORITHMS[chainA.algoId].short} consensus. Verification structures match.` 
        };
    }
    
    // EVM connection
    const isAEvm = ['eth', 'bnb', 'polygon', 'arbitrum'].includes(chainA.id);
    const isBEvm = ['eth', 'bnb', 'polygon', 'arbitrum'].includes(chainB.id);
    if (isAEvm && isBEvm) {
        return { 
            type: 'evm_compat', 
            notes: 'Both operate EVM execution environments. Smart contract calls can map across chains easily.' 
        };
    }
    
    // Default incompatibility
    return { 
        type: 'incompatible', 
        notes: `Cross-chain bridging must reconcile ${CON_ALGORITHMS[chainA.algoId].short} and ${CON_ALGORITHMS[chainB.algoId].short} models.` 
    };
}

/* -------------------------------------------------------------
 * UI Render Functions
 * ------------------------------------------------------------- */

// Render Sidebar Navigation Elements
function renderSidebar() {
    const navContainer = document.getElementById('algo-nav-list');
    navContainer.innerHTML = '';
    
    Object.values(CON_ALGORITHMS).forEach(algo => {
        const navItem = document.createElement('div');
        navItem.className = `nav-item nav-item-${algo.id} ${algo.id === currentAlgoId ? 'active' : ''}`;
        navItem.innerHTML = `
            <div class="nav-title-block">
                <span class="nav-name">${algo.name}</span>
                <span class="nav-short">${algo.short}</span>
            </div>
            <div class="nav-icon"><i class="${algo.icon}"></i></div>
        `;
        
        navItem.addEventListener('click', () => {
            selectAlgorithm(algo.id);
        });
        
        navContainer.appendChild(navItem);
    });
}

// Select and update the global selected algorithm state
function selectAlgorithm(algoId) {
    currentAlgoId = algoId;
    
    // Update theme custom property variables on the root document
    const root = document.documentElement;
    const selectedAlgo = CON_ALGORITHMS[algoId];
    root.style.setProperty('--theme-active', selectedAlgo.color);
    
    let glowVal = '0 0 15px rgba(255, 255, 255, 0.4)';
    if (algoId === 'pow') glowVal = 'var(--glow-pow)';
    if (algoId === 'pos') glowVal = 'var(--glow-pos)';
    if (algoId === 'dpos') glowVal = 'var(--glow-dpos)';
    if (algoId === 'poh') glowVal = 'var(--glow-poh)';
    if (algoId === 'bft') glowVal = 'var(--glow-bft)';
    if (algoId === 'poa') glowVal = 'var(--glow-poa)';
    if (algoId === 'poet') glowVal = 'var(--glow-poet)';
    root.style.setProperty('--theme-glow', glowVal);
    
    // Refresh components
    renderSidebar();
    renderOverviewCard();
    renderTrilemmaScorecard();
    renderBlockchainMappings();
    highlightMatrixFilteredByAlgo(algoId);
}

// Render Core Algorithm Overview Card & Stepper
function renderOverviewCard() {
    const algo = CON_ALGORITHMS[currentAlgoId];
    
    document.getElementById('algo-badge').innerText = algo.type;
    document.getElementById('algo-name').innerText = `${algo.name} (${algo.short})`;
    document.getElementById('algo-description').innerText = algo.description;
    
    // Icon wrapper theme color update
    const iconWrapper = document.getElementById('algo-icon-wrapper');
    iconWrapper.innerHTML = `<i class="${algo.icon}"></i>`;
    
    // Render Stepper nodes
    const stepperContainer = document.getElementById('algo-stepper');
    stepperContainer.innerHTML = '';
    
    algo.steps.forEach((step, index) => {
        const stepItem = document.createElement('div');
        stepItem.className = 'step-item';
        stepItem.style.animationDelay = `${index * 0.08}s`;
        
        stepItem.innerHTML = `
            <div class="step-node"></div>
            <h4 class="step-title">${step.title}</h4>
            <p class="step-desc">${step.desc}</p>
        `;
        
        stepperContainer.appendChild(stepItem);
    });
}

// Calculate SVG Radar coordinates for three dimensions
// Dimensions are: 0: Decentralization (Top), 1: Security (Bottom-Right), 2: Scalability (Bottom-Left)
function getRadarPoint(center, radius, angleDeg, value) {
    const radians = (angleDeg * Math.PI) / 180;
    const distance = (value / 100) * radius;
    return {
        x: center.x + distance * Math.cos(radians),
        y: center.y + distance * Math.sin(radians)
    };
}

// Render dynamic SVG Radar Chart & Trilemma progress cards
function renderTrilemmaScorecard() {
    const algo = CON_ALGORITHMS[currentAlgoId];
    
    // 1. Text scores update
    document.getElementById('score-dec-val').innerText = `${algo.trilemma.decentralization.score}/100`;
    document.getElementById('score-dec-desc').innerText = algo.trilemma.decentralization.desc;
    document.querySelector('#score-dec .progress-bar-fill').style.width = `${algo.trilemma.decentralization.score}%`;
    
    document.getElementById('score-sec-val').innerText = `${algo.trilemma.security.score}/100`;
    document.getElementById('score-sec-desc').innerText = algo.trilemma.security.desc;
    document.querySelector('#score-sec .progress-bar-fill').style.width = `${algo.trilemma.security.score}%`;
    
    document.getElementById('score-scal-val').innerText = `${algo.trilemma.scalability.score}/100`;
    document.getElementById('score-scal-desc').innerText = `${algo.trilemma.scalability.desc} (Block Time: ${algo.blockTime}, TPS: ${algo.tps})`;
    document.querySelector('#score-scal .progress-bar-fill').style.width = `${algo.trilemma.scalability.score}%`;
    
    // 2. SVG Radar Redraw
    const svg = document.getElementById('radar-chart');
    svg.innerHTML = ''; // Reset elements
    
    const center = { x: 200, y: 200 };
    const radius = 110;
    
    // Spokes configurations (Angles: -90 for Top, 30 for Bottom Right, 150 for Bottom Left)
    const dimensions = [
        { name: 'Decentralisation', angle: -90 },
        { name: 'Security', angle: 30 },
        { name: 'Scalability', angle: 150 }
    ];
    
    // Draw concentric grids (25%, 50%, 75%, 100%)
    const scales = [0.25, 0.50, 0.75, 1.0];
    scales.forEach(scale => {
        const pts = dimensions.map(d => getRadarPoint(center, radius * scale, d.angle, 100));
        const pathData = `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} L ${pts[2].x} ${pts[2].y} Z`;
        
        const gridPoly = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        gridPoly.setAttribute('d', pathData);
        gridPoly.setAttribute('class', 'radar-grid');
        gridPoly.setAttribute('fill', 'none');
        svg.appendChild(gridPoly);
    });
    
    // Draw Spokes
    dimensions.forEach(d => {
        const outerPt = getRadarPoint(center, radius, d.angle, 100);
        
        const spoke = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        spoke.setAttribute('x1', center.x);
        spoke.setAttribute('y1', center.y);
        spoke.setAttribute('x2', outerPt.x);
        spoke.setAttribute('y2', outerPt.y);
        spoke.setAttribute('class', 'radar-spoke');
        svg.appendChild(spoke);
        
        // Label rendering
        const labelOffset = 22;
        const labelPt = getRadarPoint(center, radius + labelOffset, d.angle, 100);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelPt.x);
        // Fine-tune Y alignment depending on angle
        text.setAttribute('y', d.angle === -90 ? labelPt.y - 5 : labelPt.y + 4);
        text.setAttribute('class', 'radar-label');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = d.name;
        svg.appendChild(text);
    });
    
    // Draw value polygon
    const valPoints = [
        getRadarPoint(center, radius, dimensions[0].angle, algo.trilemma.decentralization.score),
        getRadarPoint(center, radius, dimensions[1].angle, algo.trilemma.security.score),
        getRadarPoint(center, radius, dimensions[2].angle, algo.trilemma.scalability.score)
    ];
    const polyData = `M ${valPoints[0].x} ${valPoints[0].y} L ${valPoints[1].x} ${valPoints[1].y} L ${valPoints[2].x} ${valPoints[2].y} Z`;
    
    // Filled area
    const polyBg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    polyBg.setAttribute('d', polyData);
    polyBg.setAttribute('class', 'radar-poly-bg');
    svg.appendChild(polyBg);
    
    // Stroke line
    const polyStroke = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    polyStroke.setAttribute('d', polyData);
    polyStroke.setAttribute('class', 'radar-poly-stroke');
    svg.appendChild(polyStroke);
    
    // Draw marker nodes
    valPoints.forEach(pt => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pt.x);
        circle.setAttribute('cy', pt.y);
        circle.setAttribute('r', 5);
        circle.setAttribute('class', 'radar-point');
        svg.appendChild(circle);
    });
}

// Render Real-world Blockchain cards matching current selection
function renderBlockchainMappings() {
    const listContainer = document.getElementById('blockchain-mapping-list');
    listContainer.innerHTML = '';
    
    // Filter blockchains that use the active algorithm
    const filteredChains = BLOCKCHAINS.filter(chain => chain.algoId === currentAlgoId);
    
    if (filteredChains.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state-text" style="grid-column: 1/-1;">
                <i class="fa-solid fa-folder-open"></i>
                <p>No active blockchains in the primary catalog utilize this algorithm.</p>
            </div>
        `;
        return;
    }
    
    filteredChains.forEach(chain => {
        const card = document.createElement('div');
        card.className = 'blockchain-card';
        card.style.borderTop = `3px solid ${chain.color}`;
        
        // Define language badges
        const langBadges = chain.languages.map(lang => {
            let iconClass = 'fa-solid fa-code';
            if (lang.toLowerCase() === 'solidity') iconClass = 'fa-brands fa-ethereum';
            if (lang.toLowerCase() === 'rust') iconClass = 'fa-brands fa-rust';
            return `<span class="lang-badge"><i class="${iconClass}"></i> ${lang}</span>`;
        }).join('');
        
        const isL2 = chain.layer.toLowerCase().includes('layer 2') || chain.layer.toLowerCase().includes('hybrid');
        
        card.innerHTML = `
            <div class="blockchain-title-row">
                <div class="blockchain-name-group">
                    <div class="blockchain-logo" style="background: ${chain.color}15; border-color: ${chain.color}; color: ${chain.color};">
                        ${chain.logoLetter}
                    </div>
                    <div>
                        <span class="blockchain-name">${chain.name}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">${chain.ticker}</span>
                    </div>
                </div>
                <span class="layer-badge ${isL2 ? 'l2' : ''}">${isL2 ? 'Layer 2' : 'Layer 1'}</span>
            </div>
            <p class="blockchain-suit-reason">${chain.reason}</p>
            <div class="language-container">
                ${langBadges}
            </div>
        `;
        
        listContainer.appendChild(card);
    });
}

// Generate the 2D Compatibility Heatmap Matrix
function renderCompatibilityMatrix() {
    const table = document.getElementById('compatibility-matrix-table');
    table.innerHTML = '';
    
    // Header Row
    const headerRow = document.createElement('tr');
    const cornerTh = document.createElement('th');
    cornerTh.className = 'header-corner';
    cornerTh.textContent = 'Compatibility';
    headerRow.appendChild(cornerTh);
    
    BLOCKCHAINS.forEach(chain => {
        const th = document.createElement('th');
        th.textContent = chain.ticker;
        th.setAttribute('title', chain.name);
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // Data Rows
    BLOCKCHAINS.forEach((rowChain, rowIndex) => {
        const tr = document.createElement('tr');
        
        // Row Header
        const rowHeader = document.createElement('td');
        rowHeader.className = 'matrix-row-header';
        rowHeader.textContent = rowChain.ticker;
        rowHeader.setAttribute('title', rowChain.name);
        tr.appendChild(rowHeader);
        
        // Cells
        BLOCKCHAINS.forEach((colChain, colIndex) => {
            const td = document.createElement('td');
            const compatData = getCompatibilityType(rowChain, colChain);
            const ruleObj = COMPATIBILITY_RULES[compatData.type];
            
            // Assign class based on compatibility category
            let stateClass = '';
            let textSymbol = '✕';
            
            if (compatData.type === 'same_consensus' || compatData.type === 'parent_l2') {
                stateClass = 'cell-compat';
                textSymbol = '✓';
            } else if (compatData.type === 'evm_compat') {
                stateClass = 'cell-partial';
                textSymbol = 'E';
            } else {
                stateClass = 'cell-incompat';
                textSymbol = '✕';
            }
            
            // If they are checking self
            if (rowChain.id === colChain.id) {
                textSymbol = '●';
            }
            
            td.className = `${stateClass}`;
            td.textContent = textSymbol;
            td.setAttribute('data-row-id', rowChain.id);
            td.setAttribute('data-col-id', colChain.id);
            td.setAttribute('title', `${rowChain.name} + ${colChain.name}: ${ruleObj.status}`);
            
            // Click listener
            td.addEventListener('click', (e) => {
                // Clear any other active highlight
                document.querySelectorAll('.compatibility-table td').forEach(c => c.classList.remove('cell-active'));
                
                // Set active cell styling
                td.classList.add('cell-active');
                
                activeMatrixPair = { row: rowChain.id, col: colChain.id };
                showInteropDetails(rowChain, colChain, compatData, ruleObj);
            });
            
            tr.appendChild(td);
        });
        
        table.appendChild(tr);
    });
}

// Display Interoperability text when clicking a cell
function showInteropDetails(chainA, chainB, compatData, ruleObj) {
    const emptyState = document.getElementById('interop-empty-state');
    const content = document.getElementById('interop-content');
    
    emptyState.classList.add('hidden');
    content.classList.remove('hidden');
    
    const badge = document.getElementById('interop-status-badge');
    badge.className = `badge ${ruleObj.badgeClass}`;
    badge.textContent = ruleObj.status;
    
    document.getElementById('interop-pair-title').innerHTML = `${chainA.name} <i class="fa-solid fa-arrow-right-arrow-left"></i> ${chainB.name}`;
    document.getElementById('interop-rules').textContent = `${chainA.ticker} (${CON_ALGORITHMS[chainA.algoId].short}) & ${chainB.ticker} (${CON_ALGORITHMS[chainB.algoId].short})`;
    document.getElementById('interop-description-text').innerHTML = `<strong>Context:</strong> ${compatData.notes}<br><br>${ruleObj.desc}`;
    document.getElementById('interop-bridge-text').textContent = ruleObj.bridge;
}

// Highlight rows/cols in the matrix belonging to selected consensus algorithm
function highlightMatrixFilteredByAlgo(algoId) {
    const tableCells = document.querySelectorAll('.compatibility-table td:not(.matrix-row-header)');
    
    tableCells.forEach(cell => {
        const rowId = cell.getAttribute('data-row-id');
        const colId = cell.getAttribute('data-col-id');
        
        const chainRow = BLOCKCHAINS.find(c => c.id === rowId);
        const chainCol = BLOCKCHAINS.find(c => c.id === colId);
        
        // Check if either chain in the pair utilizes the active algorithm
        if (chainRow && chainCol && (chainRow.algoId === algoId || chainCol.algoId === algoId)) {
            cell.style.opacity = '1.0';
            cell.style.filter = 'none';
        } else {
            // Fade out unrelated pairs
            cell.style.opacity = '0.35';
            cell.style.filter = 'grayscale(0.6)';
        }
    });
}

/* -------------------------------------------------------------
 * Bootstrap
 * ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // Dynamically update stats from dataset sizes
    document.getElementById('stat-count-algos').innerText = Object.keys(CON_ALGORITHMS).length;
    document.getElementById('stat-count-chains').innerText = BLOCKCHAINS.length;

    // Initial Render
    renderSidebar();
    renderCompatibilityMatrix();
    
    // Trigger initial selection to load other dynamic card elements
    selectAlgorithm(currentAlgoId);
});
