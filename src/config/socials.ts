import { FaGithub, FaDocker, FaNpm, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { SiHuggingface, SiLeetcode, SiHackerrank } from "react-icons/si";

export const socials = {
    github: {
        name: "Github",
        icon: FaGithub,
        link: "https://github.com/ken-027"
    },
    docker: {
        name: "Docker",
        icon: FaDocker,
        link: "https://hub.docker.com/u/ken027"
    },
    huggingFace: {
        name: "Hugging Face",
        icon: SiHuggingface,
        link: "https://huggingface.co/kenneth-andales"
    },
    npm: {
        name: "NPM",
        icon: FaNpm,
        link: "https://www.npmjs.com/~ken_27"
    },
    leetcode: {
        name: "LeetCode",
        icon: SiLeetcode,
        link: "https://leetcode.com/u/ken-027"
    },
    hackerrank: {
        name: "HackerRank",
        icon: SiHackerrank,
        link: "https://www.hackerrank.com/profile/ken027"
    },
    linkedin: {
        name: "LinkedIn",
        icon: FaLinkedin,
        link: "https://www.linkedin.com/in/kenneth-andales"
    }
} as const;

export const contactInformation = {
    email: {
        name: "Email",
        icon: FaEnvelope,
        link: "mailto:keanolida7296@gmail.com",
        value: "keanolida7296@gmail.com"
    },
    location: {
        name: "Location",
        icon: FaMapMarkerAlt,
        link: "https://www.google.com/maps/place/Allen,+Northern+Samar,+Philippines",
        value: "Allen, Northern Samar, Philippines"
    }
} as const;
