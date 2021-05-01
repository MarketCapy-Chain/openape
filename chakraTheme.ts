import { extendTheme } from "@chakra-ui/react";

const gradient = "linear-gradient(90deg, #B66EFF, #6D00DB)";

const colors = {
  gradient: gradient,
  primary: "#6D00DB",
  violet: "#B66EFF",
  gray: {
    lightest: "#EAEAEA",
    light: "#999999",
    medium: "#666666",
    dark: "#333333",
    darkest: "#111111"
  }
};

const fonts = {
  heading: "Lato",
  body: "Lato",
};

const Button = {
  baseStyle: {
    borderRadius: "4px",
    boxShadow: "none !important",
    outline: "none !important",
    _hover: {
      opacity: 0.9,
    },
    _active: {
      opacity: 0.8,
    }
  },
  sizes: {
    small: {
      fontSize: "16px",
      width: "160px",
      height: "40px"
    },
    medium: {
      fontSize: "20px",
      width: "200px",
      height: "50px"
    }
  },
  variants: {
    gradient: {
      bg: "gradient",
      color: "white",
    },
    primary: {
      bg: "white",
      color: "primary",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "gray.lightest",
      _hover: {
        borderColor: "primary",
      }
    },
    normal: {
      bg: "white",
      color: "gray.medium",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "gray.lightest",
      _hover: {
        color: "black",
        borderColor: "black"
      }
    },
    dark: {
      bg: "gray.darkest",
      color: "white"
    }
  },
  // defaultProps: {
  //   size: "small",
  //   variant: "gradient"
  // }
};

const Text = {
  variants: {
    default: {
      fontSize: "16px",
      color: "gray.medium",
      fontWeight: "300"
    },
    primary: {
      fontSize: "16px",
      color: "black",
      fontWeight: "300"
    },
    label: {
      fontSize: "12px",
      color: "black",
      fontWeight: "900"
    },
    subheading: {
      fontSize: "20px",
      color: "black",
      fontWeight: "900"
    },
    heading: {
      fontSize: "32px",
      color: "black",
      fontWeight: "900"
    },
    gradient: {
      bgGradient: gradient,
      bgClip: "text",
    },
  },
  // defaultProps: {
  //   variant: "default"
  // }
};

const Heading = {
  variants: {
    large: {
      fontSize: "60px !important",
      fontWeight: "900"
    }
  },
  defaultProps: {
    variant: "large"
  }
};

const Input = {
  baseStyle: {
    field: {
      width: "300px",
      fontSize: "16px",
      fontWeight: "400",
      padding: "12px !important",
      boxShadow: "none !important",
    }
  }
};

const Textarea = {
  baseStyle: {
    fontSize: "16px",
    fontWeight: "400",
    boxShadow: "none !important",
    padding: "8px !important",
  }
};

const Link = {
  baseStyle: {
    boxShadow: "none !important",
  }
}

const components = {
  Button,
  Text,
  Heading,
  Input,
  Textarea,
  Link
};

const theme = extendTheme({ colors, fonts, components });
export default theme;
