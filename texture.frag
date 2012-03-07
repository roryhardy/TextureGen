#version 330 compatibility

uniform float     ambient, diffuse, spectral, surface_noise_amp, surface_noise_freq, shininess;
uniform vec4      specular_color, surface_color;
uniform bool      u_flat;
uniform sampler3D Noise3;

flat in vec3 vNf;
     in vec3 vNs;
flat in vec3 vLf;
     in vec3 vLs;
flat in vec3 vEf;
     in vec3 vEs;

flat in vec3 vPVf;
     in vec3 vPVs;
     in vec3 MCposition;
     in vec2 vST;

layout(location=0) out vec4 fFragColor;

vec3  RotateNormal(float angx, float angy, vec3 n);
float CalcNoise(vec4 n, float amp);

void main(){
	vec3 Normal;
	vec3 Light;
	vec3 Eye;
	vec3 my_color;

	my_color = surface_color.rgb;
	
// Noise
	vec4 nvx      = texture3D(Noise3, surface_noise_freq * MCposition);
	vec4 nvy      = texture3D(Noise3, surface_noise_freq * vec3(MCposition.xy, MCposition.z + 0.5));
	float noise_x = CalcNoise(nvx, surface_noise_amp);
	float noise_y = CalcNoise(nvy, surface_noise_amp);
// End Noise
	
	if(u_flat){
		Normal = RotateNormal(noise_x, noise_y, vNf);
		Light  = normalize(vLf);
		Eye    = normalize(vEf);
	}else{
		Normal = RotateNormal(noise_x, noise_y, vNs);
		Light  = normalize(vLs);
		Eye    = normalize(vEs);
	}
	
	vec4 ambient = vec4(ambient * my_color.rgb, 1.);

	float d      = max(dot(Normal, Light), 0.);
	vec4 diffuse = vec4(diffuse * d * my_color.rgb, 1.);

	float s = 0.;
	if(dot(Normal, Light) > 0.){					// only do specular if the light can see the point
		vec3 ref = normalize(2. * Normal * dot(Normal, Light) - Light);
		s        = pow(max(dot(Eye, ref),0.), shininess);
	}
	vec4 specular = spectral * s * specular_color;

	fFragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1.);
}

vec3 RotateNormal(float angx, float angy, vec3 n){
	float cx = cos(angx);
	float sx = sin(angx);
	float cy = cos(angy);
	float sy = sin(angy);

// rotate about x:
	float yp =  n.y*cx - n.z*sx;    // y'
	n.z      =  n.y*sx + n.z*cx;    // z'
	n.y      =  yp;
//  n.x      =  n.x;

// rotate about y:
	float xp =  n.x*cy + n.z*sy;    // x'
	n.z      = -n.x*sy + n.z*cy;    // z'
	n.x      =  xp;
//  n.y      =  n.y;

	return normalize( n );
}

float CalcNoise(vec4 n, float amp){
	float noise = n.r + n.g + n.b + n.a;
	noise = noise - 2;
	noise = noise * amp;
	return noise;
}