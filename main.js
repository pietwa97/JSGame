'use strict';

let active = false;
let curr_x;
let curr_y;
let init_x;
let init_y;
let off_x = 0;
let off_y = 0;

let wnd = document.querySelector('div.window');
/* FIXME: not working as intended */
// let wnd_bar = document.querySelector('.title-bar');

wnd.addEventListener('mousedown',
        evt => {
                [init_x, init_y, active] = [evt.clientX - off_x, evt.clientY - off_y, true];
        }
        , false);
wnd.addEventListener('mouseup',
        () => {
                [init_x, init_y, active] = [curr_x, curr_y, false];
        }, false);
wnd.addEventListener('mousemove',
        evt => {
                if (active) {
                        evt.preventDefault();
                        [curr_x, curr_y, off_x, off_y] = [
                                evt.clientX - init_x,
                                evt.clientY - init_y,
                                curr_x,
                                curr_y];

                        wnd.style.transform = `
                        translate3d(${curr_x}px, ${curr_y}px, 0)`;
                }
        }, false);

/* -------------------------------------------------------------------------- */

const canvas = document.getElementById('webgl-canvas');
let gl = canvas.getContext('webgl2');

const v_source = `#version 300 es
layout (location = 0) in vec3 pos;

void main()
{
    gl_Position = vec4(pos.x, pos.y, pos.z, 1.0);
}
`;



const f_source = `#version 300 es
precision highp float;

out vec4 FragColor;

void main()
{
    FragColor = vec4(1.0, 0.5, 0.2, 1.0);
}
`;

const triangle_vertices = new Float32Array([
         0.5,  0.5, 0.0,  // top right
         0.5, -0.5, 0.0,  // bottom right
        -0.5, -0.5, 0.0,  // bottom left
        -0.5,  0.5, 0.0   // top left
]);

const triangle_indices = new Uint16Array([
        0, 1, 3,  // first Triangle
        1, 2, 3   // second Triangle
]);

/* -------------------------------------------------------------------------- */

window.addEventListener('load', () => {
        /* TODO: move shader initialization to a separate function / class and
            then handle potential shader source errors
            (print GLSL error message and then compile basic shader instead)
         */
        const v_shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(v_shader, v_source);
        gl.compileShader(v_shader);
        if (!gl.getShaderParameter(v_shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(v_shader));
        }

        const f_shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(f_shader, f_source);
        gl.compileShader(f_shader);
        if (!gl.getShaderParameter(v_shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(f_shader));
        }

        const s_program = gl.createProgram();
        gl.attachShader(s_program, v_shader);
        gl.attachShader(s_program, f_shader);
        gl.linkProgram(s_program);
        if (!gl.getProgramParameter(s_program, gl.LINK_STATUS)) {
                throw new Error(gl.getProgramInfoLog(s_program));
        }
        gl.detachShader(s_program, v_shader);
        gl.deleteShader(v_shader);
        gl.detachShader(s_program, f_shader);
        gl.deleteShader(f_shader);



        const triangle_vao = gl.createVertexArray();
        gl.bindVertexArray(triangle_vao);

        const triangle_vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangle_vbo);
        gl.bufferData(gl.ARRAY_BUFFER, triangle_vertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        const triangle_ebo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangle_ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangle_indices, gl.STATIC_DRAW);


        gl.bindVertexArray(null);



        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // testing
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(s_program);
        gl.bindVertexArray(triangle_vao);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
});
