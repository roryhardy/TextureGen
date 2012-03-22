#version 330 compatibility

uniform float edge_offset;
uniform sampler2D TexUnit;

in vec2 vST;

vec3 get_rgbs(vec2 st);

void main() {
	float u;
	vec3 rgb;
	vec2 stp = vec2(vST.s, 1. - vST.t);

	vec3 c = get_rgbs(vST);
	vec3 cp = get_rgbs(stp);

	if (vST.t <= edge_offset) {
		u = .5 + .5 * vST.t / edge_offset;
		rgb = u * c + (1. - u) * cp;
	} else if (vST.t >= 1. - edge_offset) {
		u = .5 * (vST.t - 1. + edge_offset) / edge_offset;
		rgb = u * cp + (1. - u) * c;
	} else
		rgb = c;

	gl_FragColor = vec4(rgb, 1.);
}

vec3 get_rgbs(vec2 st) {
	vec3 rgbs;
	float u;
	vec3 c = texture2D(TexUnit, st).rgb;
	vec3 cp = texture2D(TexUnit, vec2(1. - st.s, st.t)).rgb;

	if (st.s <= edge_offset) {
		u = .5 + .5 * st.s / edge_offset;
		rgbs = u * c + (1. - u) * cp;
	} else if (st.s >= 1. - edge_offset) {
		u = .5 * (st.s - 1. + edge_offset) / edge_offset;
		rgbs = u * cp + (1. - u) * c;
	} else
		rgbs = c;

	return rgbs;
}
