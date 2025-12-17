"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../../../components/Footer";
import {
  FaArrowLeft,
  FaUsers,
  FaSearch,
  FaFilter,
  FaGlobe,
  FaUserPlus,
  FaRocket,
  FaHeart,
  FaComments,
  FaStar,
} from "react-icons/fa";

// Mock peer data
const mockPeers = [
  {
    id: 1,
    name: "Alex M.",
    country: "United States",
    major: "Computer Science",
    targetUniversities: ["MIT", "Stanford", "UC Berkeley"],
    interests: ["Machine Learning", "Robotics", "Web Development"],
    gpa: "3.9+",
    isConnected: false,
    mutualConnections: 3,
    joinedDate: "2024-09-15",
    activePosts: 12,
  },
  {
    id: 2,
    name: "Sarah K.",
    country: "Canada",
    major: "Biomedical Engineering",
    targetUniversities: ["Harvard", "Johns Hopkins", "University of Toronto"],
    interests: ["Research", "Healthcare Innovation", "Biology"],
    gpa: "3.85+",
    isConnected: true,
    mutualConnections: 2,
    joinedDate: "2024-08-20",
    activePosts: 8,
  },
  {
    id: 3,
    name: "Emma L.",
    country: "United Kingdom",
    major: "International Relations",
    targetUniversities: ["Oxford", "Cambridge", "LSE"],
    interests: ["Politics", "Languages", "Debate"],
    gpa: "A*",
    isConnected: false,
    mutualConnections: 1,
    joinedDate: "2024-10-05",
    activePosts: 15,
  },
  {
    id: 4,
    name: "David C.",
    country: "Australia",
    major: "Environmental Science",
    targetUniversities: ["Stanford", "MIT", "University of Melbourne"],
    interests: ["Climate Change", "Sustainability", "Research"],
    gpa: "3.8+",
    isConnected: false,
    mutualConnections: 0,
    joinedDate: "2024-07-12",
    activePosts: 6,
  },
  {
    id: 5,
    name: "Maria G.",
    country: "Spain",
    major: "Business Administration",
    targetUniversities: ["Wharton", "INSEAD", "IE Business School"],
    interests: ["Entrepreneurship", "Finance", "Marketing"],
    gpa: "9.2/10",
    isConnected: false,
    mutualConnections: 2,
    joinedDate: "2024-09-01",
    activePosts: 10,
  },
  {
    id: 6,
    name: "Raj P.",
    country: "India",
    major: "Data Science",
    targetUniversities: ["Carnegie Mellon", "UC Berkeley", "IIT Bombay"],
    interests: ["AI/ML", "Data Analytics", "Programming"],
    gpa: "9.5/10",
    isConnected: false,
    mutualConnections: 1,
    joinedDate: "2024-06-30",
    activePosts: 18,
  },
  {
    id: 7,
    name: "Sophie T.",
    country: "France",
    major: "Architecture",
    targetUniversities: [
      "MIT",
      "Architectural Association",
      "École des Beaux-Arts",
    ],
    interests: ["Design", "Urban Planning", "Sustainability"],
    gpa: "17/20",
    isConnected: true,
    mutualConnections: 3,
    joinedDate: "2024-08-15",
    activePosts: 9,
  },
  {
    id: 8,
    name: "Chen W.",
    country: "Singapore",
    major: "Medicine",
    targetUniversities: ["Harvard Medical", "Johns Hopkins", "NUS Medicine"],
    interests: ["Healthcare", "Research", "Community Service"],
    gpa: "4.0",
    isConnected: false,
    mutualConnections: 0,
    joinedDate: "2024-10-20",
    activePosts: 4,
  },
];

export default function PeerNetwork() {
  const [peers, setPeers] = useState(mockPeers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("All");
  const [filterMajor, setFilterMajor] = useState("All");
  const [sortBy, setSortBy] = useState("activity");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState<any>(null);

  useEffect(() => {
    document.title = "Peer Network | Paccy";
  }, []);

  const filteredPeers = peers
    .filter((peer) => {
      const matchesSearch =
        peer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        peer.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
        peer.targetUniversities.some((uni) =>
          uni.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCountry =
        filterCountry === "All" || peer.country === filterCountry;
      const matchesMajor = filterMajor === "All" || peer.major === filterMajor;

      return matchesSearch && matchesCountry && matchesMajor;
    })
    .sort((a, b) => {
      if (sortBy === "activity") {
        return b.activePosts - a.activePosts;
      }
      if (sortBy === "joined") {
        return (
          new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        );
      }
      if (sortBy === "connections") {
        return b.mutualConnections - a.mutualConnections;
      }
      return 0;
    });

  const countries = Array.from(new Set(peers.map((peer) => peer.country)));
  const majors = Array.from(new Set(peers.map((peer) => peer.major)));

  const handleConnect = (peerId: number) => {
    setPeers((prev) =>
      prev.map((peer) =>
        peer.id === peerId ? { ...peer, isConnected: !peer.isConnected } : peer
      )
    );
  };

  const handleStartProject = (peer: any) => {
    setSelectedPeer(peer);
    setShowProjectModal(true);
  };

  const getConnectedPeers = () => {
    return peers.filter((peer) => peer.isConnected);
  };

  const getTotalConnections = () => {
    return peers.reduce((total, peer) => total + peer.mutualConnections, 0);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-white/70 hover:text-white transition-colors"
            >
              <FaArrowLeft size={20} />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Peer Network
              </h1>
              <p className="text-white/70 mt-2 text-sm sm:text-base">
                Connect and collaborate with fellow students worldwide
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {getConnectedPeers().length}
              </div>
              <div className="text-white/60 text-sm">Your Connections</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {peers.length}
            </div>
            <div className="text-white/60 text-sm">Total Peers</div>
          </div>

          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {getConnectedPeers().length}
            </div>
            <div className="text-white/60 text-sm">Your Connections</div>
          </div>

          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {countries.length}
            </div>
            <div className="text-white/60 text-sm">Countries</div>
          </div>

          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {majors.length}
            </div>
            <div className="text-white/60 text-sm">Majors</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaUsers className="text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Discover Peers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search by name, major, or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="All">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <select
              value={filterMajor}
              onChange={(e) => setFilterMajor(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="All">All Majors</option>
              {majors.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="activity">Sort by Activity</option>
              <option value="joined">Sort by Join Date</option>
              <option value="connections">Sort by Connections</option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => {
              setFilterCountry("All");
              setFilterMajor("All");
              setSearchTerm("");
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            All Peers
          </button>
          <button
            onClick={() => setFilterMajor("Computer Science")}
            className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500/20 transition-colors"
          >
            Computer Science
          </button>
          <button
            onClick={() => setFilterMajor("Engineering")}
            className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500/20 transition-colors"
          >
            Engineering
          </button>
          <button
            onClick={() => setFilterCountry("United States")}
            className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500/20 transition-colors"
          >
            United States
          </button>
          <button
            onClick={() => setFilterCountry("Canada")}
            className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500/20 transition-colors"
          >
            Canada
          </button>
        </div>

        {/* Peer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredPeers.map((peer) => (
            <div
              key={peer.id}
              className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white text-xl font-bold">
                    {peer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h4 className="text-white font-semibold">{peer.name}</h4>
                <div className="flex items-center justify-center gap-2 text-sm text-white/60 mt-1">
                  <FaGlobe size={12} />
                  <span>{peer.country}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-white/60 text-sm">Intended Major:</span>
                  <p className="text-white font-medium">{peer.major}</p>
                </div>

                <div>
                  <span className="text-white/60 text-sm">
                    Target Universities:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {peer.targetUniversities.slice(0, 2).map((uni, idx) => (
                      <span
                        key={idx}
                        className="bg-neutral-800/50 text-white/80 text-xs px-2 py-1 rounded-full"
                      >
                        {uni}
                      </span>
                    ))}
                    {peer.targetUniversities.length > 2 && (
                      <span className="text-white/60 text-xs">
                        +{peer.targetUniversities.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-white/60 text-sm">Interests:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {peer.interests.slice(0, 2).map((interest, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">
                    GPA: <span className="text-green-400">{peer.gpa}</span>
                  </span>
                  <span className="text-white/60 flex items-center gap-1">
                    <FaComments size={12} />
                    {peer.activePosts} posts
                  </span>
                </div>

                {peer.mutualConnections > 0 && (
                  <div className="text-xs text-white/60 flex items-center gap-1">
                    <FaUsers size={10} />
                    {peer.mutualConnections} mutual connections
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleConnect(peer.id)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    peer.isConnected
                      ? "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20"
                  }`}
                >
                  {peer.isConnected ? <FaHeart /> : <FaUserPlus />}
                  <span>{peer.isConnected ? "Connected" : "Connect"}</span>
                </button>

                <button
                  onClick={() => handleStartProject(peer)}
                  className="w-full bg-purple-500/10 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg font-medium hover:bg-purple-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <FaRocket />
                  <span>Start Project Together</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPeers.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="mx-auto text-white/30 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-white/70 mb-2">
              No peers found
            </h3>
            <p className="text-white/50">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Connected Peers Section */}
        {getConnectedPeers().length > 0 && (
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaHeart className="text-green-400" />
              Your Connections ({getConnectedPeers().length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getConnectedPeers().map((peer) => (
                <div
                  key={peer.id}
                  className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <span className="text-white font-bold">
                        {peer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{peer.name}</h4>
                      <p className="text-white/60 text-sm">{peer.major}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full mx-auto mb-4 flex items-center justify-center border border-purple-500/30">
                <FaRocket className="text-purple-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Coming Soon!
              </h3>
              <p className="text-white/70 mb-6">
                You'll soon be able to launch collaborative projects with{" "}
                <span className="text-white font-medium">
                  {selectedPeer?.name}
                </span>
                . Stay tuned for this exciting feature!
              </p>
              <button
                onClick={() => setShowProjectModal(false)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
