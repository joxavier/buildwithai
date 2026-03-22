"use-client"
import React, { useState, useRef, useEffect } from "react";"use"
import { Camera, Sparkles, CheckCircle } from "lucide-react";

// Metaparlour service images
const styleImages = {
  "Layered Cut":
    "https://raw.createusercontent.com/e4f64cdb-6849-4c17-91a9-fbf63dc4541d/",
  "Beard Line-up":
    "https://raw.createusercontent.com/d18bdd29-c2d9-46a1-b9b3-354f050437e5/",
  Fade: "https://raw.createusercontent.com/451898fb-1b82-40f0-910d-8ccd717628a3/",
  "Classic Haircut":
    "https://raw.createusercontent.com/facee186-894d-4a4e-870c-3834ecc708ac/",
  "Beach Waves":
    "https://raw.createusercontent.com/8afbd6b7-5123-4392-8ebf-2eac6ab36169/",
  "Curly Styling":
    "https://raw.createusercontent.com/2d3fa854-1968-4862-9884-8b94a0c99be6/",
};

export default function YourStyle() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      setIsStreaming(true);
      setError("");
      setCapturedImage(null);
      setAnalysis(null);
    } catch (err) {
      console.error("Camera error:", err);
      setError(
        "Unable to access camera. Please ensure you have granted permission.",
      );
    }
  };

  useEffect(() => {
    if (isStreaming && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
        setError("Unable to start video stream");
      });
    }
  }, [isStreaming]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);
    stopCamera();
    analyzePhoto(imageData);
  };

  const analyzePhoto = async (imageData) => {
    try {
      setIsAnalyzing(true);
      setError("");

      const response = await fetch("/api/analyze-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze photo");
      }

      const data = await response.json();

      // Add Metaparlour services and pricing
      if (data.recommendations) {
        data.recommendations = data.recommendations.map((rec, idx) => {
          const metaparlourServices = [
            {
              name: "Layered Cut",
              price: "$140",
              image: styleImages["Layered Cut"],
            },
            { name: "Fade", price: "$25", image: styleImages["Fade"] },
            {
              name: "Classic Haircut",
              price: "$30",
              image: styleImages["Classic Haircut"],
            },
            {
              name: "Beard Line-up",
              price: "$15",
              image: styleImages["Beard Line-up"],
            },
            {
              name: "Beach Waves",
              price: "$140",
              image: styleImages["Beach Waves"],
            },
            {
              name: "Curly Styling",
              price: "$140",
              image: styleImages["Curly Styling"],
            },
          ];

          const service = metaparlourServices[idx] || metaparlourServices[0];
          return {
            ...rec,
            style: service.name,
            price: service.price,
            image: service.image,
          };
        });
      }

      setAnalysis(data);
    } catch (err) {
      console.error("Error analyzing photo:", err);
      setError("Unable to analyze your photo. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setAnalysis(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <>
      <head>
        <title>Metaparlour - AI Style Matcher</title>
        <meta
          name="description"
          content="Find your perfect hairstyle with AI-powered recommendations from Metaparlour"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <main
        style={{
          background: "linear-gradient(180deg, #000000 0%, #1a0a1f 100%)",
          minHeight: "100vh",
          color: "#ffffff",
          padding: "40px 20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "800",
              marginBottom: "16px",
              background:
                "linear-gradient(90deg, #d4af37 0%, #f4e5a1 50%, #d4af37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Metaparlour
          </h1>
          <p
            style={{
              fontSize: "20px",
              color: "#9ca3af",
            }}
          >
            AI-Powered Style Recommendations
          </p>
        </div>

        {/* AI Style Matcher Section */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)",
              border: "2px solid rgba(147, 51, 234, 0.3)",
              borderRadius: "24px",
              padding: "40px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "40px",
              }}
            >
              <h2
                style={{
                  fontSize: "42px",
                  fontWeight: "700",
                  marginBottom: "16px",
                  background:
                    "linear-gradient(90deg, #9333ea 0%, #db2777 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI Style Matcher
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  color: "#d1d5db",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Get personalized hairstyle recommendations powered by AI
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  backgroundColor: "rgba(220, 38, 38, 0.1)",
                  padding: "16px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  color: "#fca5a5",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            {/* Camera/Photo View */}
            <div
              style={{
                position: "relative",
                maxWidth: "640px",
                margin: "0 auto",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#000",
                minHeight: "400px",
                border: "3px solid rgba(212, 175, 55, 0.3)",
              }}
            >
              {!isStreaming && !capturedImage && (
                <div
                  style={{
                    padding: "80px 20px",
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(0, 0, 0, 0.5) 100%)",
                  }}
                >
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                    }}
                  >
                    <Camera size={48} color="#fff" />
                  </div>
                  <p
                    style={{
                      marginBottom: "32px",
                      color: "#d1d5db",
                      fontSize: "16px",
                      lineHeight: "1.6",
                    }}
                  >
                    Capture a photo to discover your perfect hairstyle
                    <br />
                    from our expert collection
                  </p>
                  <button
                    onClick={startCamera}
                    style={{
                      background:
                        "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
                      color: "#fff",
                      padding: "16px 48px",
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "18px",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(147, 51, 234, 0.4)",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Start Camera
                  </button>
                </div>
              )}

              {isStreaming && (
                <div style={{ position: "relative" }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: "100%",
                      display: "block",
                      backgroundColor: "#000",
                    }}
                  />
                  {/* Face guide overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "280px",
                      height: "380px",
                      borderRadius: "140px",
                      border: "3px dashed rgba(212, 175, 55, 0.8)",
                      boxShadow: "0 0 40px rgba(212, 175, 55, 0.3)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Camera controls */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "30px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={capturePhoto}
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "36px",
                        background:
                          "linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)",
                        border: "4px solid #d4af37",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <div
                        style={{
                          width: "54px",
                          height: "54px",
                          borderRadius: "27px",
                          background:
                            "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
                        }}
                      />
                    </button>
                    <button
                      onClick={stopCamera}
                      style={{
                        background: "rgba(0, 0, 0, 0.8)",
                        color: "#fff",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        border: "1px solid rgba(212, 175, 55, 0.5)",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {capturedImage && (
                <div style={{ position: "relative" }}>
                  <img
                    src={capturedImage}
                    alt="Captured"
                    style={{
                      width: "100%",
                      display: "block",
                    }}
                  />
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            {/* Loading State */}
            {isAnalyzing && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  marginTop: "40px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    border: "4px solid rgba(147, 51, 234, 0.1)",
                    borderTop: "4px solid #9333ea",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 24px",
                  }}
                />
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                >
                  Analyzing your style...
                </p>
                <style jsx>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && !isAnalyzing && (
              <div
                style={{
                  maxWidth: "900px",
                  margin: "40px auto 0",
                }}
              >
                {/* Hair Type Badge */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
                    padding: "40px",
                    borderRadius: "20px",
                    textAlign: "center",
                    marginBottom: "32px",
                    boxShadow: "0 8px 32px rgba(147, 51, 234, 0.3)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "12px",
                    }}
                  >
                    Your Hair Type
                  </p>
                  <p
                    style={{
                      fontSize: "64px",
                      fontWeight: "800",
                      marginBottom: "12px",
                      textShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    {analysis.hairType}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "rgba(255,255,255,0.9)",
                      lineHeight: "1.6",
                      maxWidth: "500px",
                      margin: "0 auto",
                    }}
                  >
                    {analysis.hairTypeDescription}
                  </p>
                </div>

                {/* Face Shape & Current Hair */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginBottom: "32px",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(147, 51, 234, 0.1)",
                      padding: "24px",
                      borderRadius: "16px",
                      border: "1px solid rgba(147, 51, 234, 0.2)",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#d4af37",
                      }}
                    >
                      <Sparkles size={18} /> Face Shape
                    </p>
                    <p style={{ color: "#e5e7eb", fontSize: "15px" }}>
                      {analysis.faceShape}
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(219, 39, 119, 0.1)",
                      padding: "24px",
                      borderRadius: "16px",
                      border: "1px solid rgba(219, 39, 119, 0.2)",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#d4af37",
                      }}
                    >
                      <Sparkles size={18} /> Current Hair
                    </p>
                    <p style={{ color: "#e5e7eb", fontSize: "15px" }}>
                      {analysis.currentHair}
                    </p>
                  </div>
                </div>

                {/* Metaparlour Recommendations */}
                <div style={{ marginBottom: "32px" }}>
                  <h3
                    style={{
                      fontSize: "28px",
                      fontWeight: "800",
                      marginBottom: "24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background:
                        "linear-gradient(90deg, #d4af37 0%, #f4e5a1 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    <Sparkles size={24} /> Metaparlour Services For You
                  </h3>
                  {analysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(26,10,31,0.8) 100%)",
                        border: "2px solid rgba(212, 175, 55, 0.3)",
                        borderRadius: "20px",
                        marginBottom: "20px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection:
                          window.innerWidth < 768 ? "column" : "row",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      }}
                    >
                      {/* Service Image */}
                      {rec.image && (
                        <div
                          style={{
                            width: window.innerWidth < 768 ? "100%" : "200px",
                            height: "200px",
                            flexShrink: 0,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={rec.image}
                            alt={rec.style}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "12px",
                              right: "12px",
                              background:
                                "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
                              color: "#fff",
                              padding: "6px 16px",
                              borderRadius: "20px",
                              fontSize: "14px",
                              fontWeight: "700",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                            }}
                          >
                            {rec.price}
                          </div>
                        </div>
                      )}

                      {/* Service Details */}
                      <div style={{ padding: "24px", flex: 1 }}>
                        <h4
                          style={{
                            fontSize: "24px",
                            fontWeight: "800",
                            marginBottom: "12px",
                            color: "#d4af37",
                          }}
                        >
                          {rec.style}
                        </h4>
                        <p
                          style={{
                            fontSize: "15px",
                            color: "#d1d5db",
                            marginBottom: "16px",
                            lineHeight: "1.6",
                          }}
                        >
                          {rec.description}
                        </p>
                        <div
                          style={{
                            paddingTop: "16px",
                            borderTop: "1px solid rgba(212, 175, 55, 0.2)",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#9ca3af",
                              fontWeight: "700",
                              marginBottom: "6px",
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                            }}
                          >
                            Why it works for you:
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#e5e7eb",
                              lineHeight: "1.5",
                              display: "flex",
                              alignItems: "start",
                              gap: "8px",
                            }}
                          >
                            <CheckCircle
                              size={16}
                              color="#d4af37"
                              style={{ marginTop: "2px", flexShrink: 0 }}
                            />
                            {rec.whyItWorks}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Book Now CTA */}
                  <a
                    href="https://shop.metaparlour.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      background:
                        "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
                      color: "#000",
                      padding: "18px",
                      borderRadius: "12px",
                      fontSize: "18px",
                      fontWeight: "800",
                      textDecoration: "none",
                      marginTop: "24px",
                      boxShadow: "0 8px 24px rgba(212, 175, 55, 0.4)",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Book Your Service at Metaparlour →
                  </a>
                </div>

                {/* Tips & Products */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      window.innerWidth < 768 ? "1fr" : "repeat(2, 1fr)",
                    gap: "20px",
                    marginBottom: "32px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#d4af37",
                      }}
                    >
                      <Sparkles size={20} /> Pro Styling Tips
                    </h4>
                    {analysis.tips.map((tip, index) => (
                      <div
                        key={index}
                        style={{
                          background: "rgba(147, 51, 234, 0.1)",
                          border: "1px solid rgba(147, 51, 234, 0.2)",
                          padding: "14px",
                          borderRadius: "12px",
                          marginBottom: "10px",
                          fontSize: "14px",
                          color: "#e5e7eb",
                          lineHeight: "1.5",
                        }}
                      >
                        • {tip}
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#d4af37",
                      }}
                    >
                      <Sparkles size={20} /> Recommended Products
                    </h4>
                    {analysis.productRecommendations.map((product, index) => (
                      <div
                        key={index}
                        style={{
                          background: "rgba(219, 39, 119, 0.1)",
                          border: "1px solid rgba(219, 39, 119, 0.2)",
                          padding: "14px",
                          borderRadius: "12px",
                          marginBottom: "10px",
                          fontSize: "14px",
                          color: "#e5e7eb",
                          lineHeight: "1.5",
                        }}
                      >
                        • {product}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Retake Button */}
                <button
                  onClick={retakePhoto}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%)",
                    border: "2px solid rgba(147, 51, 234, 0.5)",
                    color: "#fff",
                    padding: "14px 32px",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    width: "100%",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #9333ea 0%, #db2777 100%)";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Try Another Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
