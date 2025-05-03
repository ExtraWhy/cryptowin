precision mediump float;

uniform vec2 u_resolution;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    // Distance from the diagonal line (y = x)
    float dist = abs(st.y - st.x);

    // Thin band for the line: width = 0.01
    float alpha = smoothstep(0.01, 0.0, dist);

    // Red to Blue gradient along X axis
    vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), st.x);

    gl_FragColor = vec4(color, alpha);
}
