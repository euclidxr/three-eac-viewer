//  mode: 0 nothing, 1 vertex, 2 face, 3 vertex & face
import * as THREE from'./three.module.js';

let verticesCount;
// let facesCount;

let vertexNumbers = [];
let faceNumbers = [];
let materialDigits;
let geometryDigit = [];
let digit = [];
let d100, d10, d1;		// digits
let coordDigit = [];	// design of the digits

// let digitPositions = [];

let i100 =  0;
let i10  =  0;
let i1   = -1;

class VertexFaceNumbersHelper {

  constructor(mesh, mode, size, camera) {
    this.mesh = mesh;
    this.size = size;
    this.camera = camera;
    materialDigits = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    coordDigit[ 0 ] = [ 0,0, 0,9, 6,9, 6,0, 0,0 ];
    coordDigit[ 1 ] = [ 0,6, 3,9, 3,0 ];
    coordDigit[ 2 ] = [ 0,9, 6,9, 6,6, 0,0, 6,0 ];
    coordDigit[ 3 ] = [ 0,9, 6,9, 6,5, 3,5, 6,5, 6,0, 0,0 ];
    coordDigit[ 4 ] = [ 0,9, 0,5, 6,5, 3,5, 3,6, 3,0 ];
    coordDigit[ 5 ] = [ 6,9, 0,9, 0,5, 6,5, 6,0, 0,0 ];
    coordDigit[ 6 ] = [ 6,9, 0,9, 0,0, 6,0, 6,5, 0,5 ];
    coordDigit[ 7 ] = [ 0,9, 6,9, 6,6, 0,0 ];
    coordDigit[ 8 ] = [ 0,0, 0,9, 6,9, 6,5, 0,5, 6,5, 6,0, 0,0 ];
    coordDigit[ 9 ] = [ 6,5, 0,5, 0,9, 6,9, 6,0, 0,0 ];

    if ( mesh.geometry) {

      if ( mode === 1 || mode === 3 ) {

        // verticesCount = 248;

        verticesCount = mesh.geometry.getAttribute("position").array.length / 3;

      }

      // if ( mode === 2 || mode === 3 ) {
      //
      //   facesCount = mesh.geometry.faces.length ;
      //
      // }

      for ( let i = 0; i<10; i ++ ) {

        const points = [];


        for ( let j = 0; j < coordDigit[ i ].length/ 2; j ++ ) {

          points.push( new THREE.Vector3( 0.1 * size * coordDigit[ i ][ 2 * j ], 0.1 * size * coordDigit[ i ][ 2 * j + 1 ], 0 ) );

        }

        geometryDigit[ i ]  = new THREE.BufferGeometry().setFromPoints( points );

        digit[ i ] = new THREE.Line( geometryDigit[ i ], materialDigits );

      }

      if ( mode === 1 || mode === 3 ) {

        for ( let i = 0; i < verticesCount ; i ++ ) {

          // Number on board, up to three digits are pinned there

          const board = new THREE.Mesh( new THREE.BufferGeometry() );

          this.numbering(board); // numbering the vertices, hundreds ...

          vertexNumbers.push( board );	// place the table in the vertex numbering data field
          mesh.add( vertexNumbers[ i ] );

        }

      }

      // if ( mode === 2 || mode === 3 ) {
      //   for ( let i = 0; i < facesCount ; i ++ ) {
      //
      //     // Number on board, up to three digits are pinned there
      //
      //     let board = new THREE.Mesh( new THREE.BufferGeometry() );
      //
      //     this.numbering(); // numbering the facesces, hundreds ...
      //
      //     faceNumbers.push( board );	// place the table in the face numbering data field
      //     mesh.add( faceNumbers[ i ] );
      //
      //   }
      //
      // }

    }
  }

  numbering = (board) => {

    i1 ++;														// starts with  -1 + 1 = 0

    if ( i1   === 10 ) {i1   = 0; i10 ++ }
    if ( i10  === 10 ) {i10  = 0; i100 ++ }
    if ( i100 === 10 ) {i100 = 0 }								// hundreds (reset when overflow)

    if ( i100 > 0 ) {

      d100 = digit[ i100 ].clone();							// digit for hundreds
      board.add( d100 );										// on the board ...
      d100.position.x = -8 * 0.1 * this.size;						// ... move slightly to the left

    }

    if ( ( i100 > 0 ) || ( ( i100 === 0 ) && ( i10 > 0 ) ) ) {	// no preceding zeros tens

      d10 = digit[ i10 ].clone();								// digit for tenth
      board.add( d10 );										// on the board

    }

    d1 =   digit[ i1 ].clone();									// digit
    board.add( d1 );											//  on the board ...
    d1.position.x = 8 * 0.1 * this.size;		 						// ... move slightly to the right

  }

  update = ( mode ) => {

    // let x, y, z;

    // Geometry
    const { mesh } = this;

    const vertexArray = mesh.geometry.getAttribute('position').array;

    if ( mesh.geometry ) {

      if ( mode === 1 || mode === 3 ) {

        for( let n = 0; n < vertexNumbers.length; n ++ ) {

          vertexNumbers[ n ].position.set( vertexArray[ 3 * n ], vertexArray[ 3 * n + 1 ] + 0.5, vertexArray[ 3 * n + 2 ]);
          vertexNumbers[ n ].quaternion.copy(this.camera.quaternion);

        }

      }

      // if ( mode === 2 || mode === 3 ) {
      //
      //   for( let n = 0; n < faceNumbers.length; n ++ ) {
      //
      //     x = 0;
      //     x += mesh.geometry.vertices[ mesh.geometry.faces[ n ].a ].x;
      //     x += mesh.geometry.vertices[ mesh.geometry.faces[ n ].b ].x;
      //     x += mesh.geometry.vertices[ mesh.geometry.faces[ n ].c ].x;
      //     x /= 3;
      //
      //     y = 0;
      //     y += mesh.geometry.vertices[ mesh.geometry.faces[ n ].a ].y;
      //     y += mesh.geometry.vertices[ mesh.geometry.faces[ n ].b ].y;
      //     y += mesh.geometry.vertices[ mesh.geometry.faces[ n ].c ].y;
      //     y /= 3;
      //
      //     z = 0;
      //     z += mesh.geometry.vertices[ mesh.geometry.faces[ n ].a ].z;
      //     z += mesh.geometry.vertices[ mesh.geometry.faces[ n ].b ].z;
      //     z += mesh.geometry.vertices[ mesh.geometry.faces[ n ].c ].z;
      //     z /= 3;
      //
      //     faceNumbers[ n ].position.set( x, y, z );
      //     faceNumbers[ n ].quaternion.copy(camera.quaternion);
      //
      //   }
      //
      // }

    }

  }

}

export { VertexFaceNumbersHelper }
