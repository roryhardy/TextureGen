#version 330 compatibility

uniform float ambient, diffuse, spectral, shininess, light_x, light_y, light_z;
uniform vec4  surface_color, specular_color;

flat out vec3 vNf;
     out vec3 vNs;
flat out vec3 vLf;
     out vec3 vLs;
flat out vec3 vEf;
     out vec3 vEs;
flat out vec3 vPVf;
     out vec3 vPVs;
	 
out vec3 MCposition;
out vec2 vST;

void main(){ 
	vST = gl_MultiTexCoord0.st;
	
	MCposition = gl_Vertex.xyz;

	vec4 ECposition       = uModelViewMatrix * vec4(MCposition, 1.);
	vec3 eyeLightPosition = vec3(light_x, light_y, light_z);

// Normal Calc
	vec3 normal = aNormal;
// End Normal

	vNs = normalize(uNormalMatrix * normal);		// surface normal vector
	vNf = vNs;

	vLs = eyeLightPosition - ECposition.xyz;		// vector from the point
	vLf = vLs;
													// to the light position
	vEs = vec3(0., 0., 0.) - ECposition.xyz;		// vector from the point
	vEf = vEs;

	vec3 Normal;
	vec3 Light;
	vec3 Eye;
		

	Normal = normalize(vNs);
	Light  = normalize(vLs);
	Eye    = normalize(vEs);

	vec4 ambient = ambient * surface_color;

	float d      = max(dot(Normal, Light), 0.);
	vec4 diffuse = diffuse * d * surface_color;
	
	float s = 0.;
	if(dot(Normal, Light) > 0.){				// only do specular if the light can see the point
		vec3 ref = normalize(2. * Normal * dot(Normal,Light) - Light);
		s        = pow(max(dot(Eye, ref),0.), shininess);
	}
	vec4 specular = spectral * s * specular_color;

	vPVs = ambient.rgb + diffuse.rgb + specular.rgb;
	vPVf = vPVs;
	
	gl_Position = uModelViewProjectionMatrix * vec4(MCposition, 1);
}