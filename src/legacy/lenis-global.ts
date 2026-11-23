// TQ-01 parity: the live site loaded Lenis 1.1.5 from a CDN <script defer>
// before toronique.js. The footer loader adds this bundle dynamically, so a
// sibling CDN tag would no longer be sure to run first (AGENTS.md); the same
// version is bundled instead and set on window before the legacy file runs,
// which checks `typeof Lenis`.
import Lenis from 'lenis';

(window as unknown as { Lenis: typeof Lenis }).Lenis = Lenis;
