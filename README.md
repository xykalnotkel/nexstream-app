# NexStream V2

A modern, resilient, and highly available video streaming interface built with Next.js (Frontend) and Go (Backend). NexStream employs an intelligent fallback mechanism to fetch data from multiple independent endpoints, ensuring maximum uptime without relying on a single point of failure.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)](https://golang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org/)

## Features (V2 Update)
- **Smart API Fallback:** The Go backend tests multiple data sources on every request (Search, Video Details, Comments).
- **Zustand State Management:** High-performance local storage for Likes, Subscriptions, and History.
- **SponsorBlock Integration:** Automatically skips sponsored segments via the official SponsorBlock API.
- **Modern UI Components:** Bottom Navigation (Mobile), Bottom Sheets (Framer Motion), Error States, and Empty States.
- **Multi-page Architecture:** Home, Shorts, Subscriptions, Profile, and Watch Page.

## Third-Party Libraries & Licenses

This project utilizes several open-source libraries and APIs. All credits go to their respective creators:

- **[Next.js](https://github.com/vercel/next.js/)** (MIT License)
- **[Go](https://github.com/golang/go)** (BSD-3-Clause)
- **[Zustand](https://github.com/pmndrs/zustand)** (MIT License) - Fast and scalable state management.
- **[Framer Motion](https://github.com/framer/motion)** (MIT License) - Animation library for React.
- **[SWR](https://github.com/vercel/swr)** (MIT License) - React Hooks for Data Fetching.
- **[Lucide React](https://github.com/lucide-icons/lucide)** (ISC License) - Beautiful icons.
- **[React YouTube](https://github.com/tjallingt/react-youtube)** (MIT License) - YouTube Player Iframe API wrapper.
- **[Invidious API](https://github.com/iv-org/invidious)** (AGPL-3.0 License) - Open source alternative front-end to YouTube (used purely as a public API fallback data source).
- **[SponsorBlock API](https://sponsor.ajay.app/)** (CC BY-NC-SA 4.0 / GPL-3.0) - Crowdsourced sponsor skipping API.

## Production Deployment Strategy (Vercel)

This application is fully compatible with Vercel Serverless Functions out of the box. The Go backend (`api/*.go`) is automatically compiled and hosted as AWS Lambda functions on Vercel Edge/Region network.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Made by XySpace