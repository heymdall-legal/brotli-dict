load("@rules_cc//cc:defs.bzl", "cc_library", "cc_binary")
load("@emsdk//emscripten_toolchain:wasm_rules.bzl", "wasm_cc_binary")

package(default_visibility = ["//visibility:public"])

cc_binary(
    name = "compress.js",
    srcs = ["compress.c"],
    linkopts = [
        "--bind",                           # Compiles the source code using the Embind bindings to connect C/C++ and JavaScript
        "-O3",
        "--closure 1",                      # Run the closure compiler
        "-s MODULARIZE=1",                  # Allows us to manually invoke the initializatio of wasm
        "-s NO_FILESYSTEM=1",               # Allows us to manually invoke the initializatio of wasm
        "-s TOTAL_MEMORY=318767104",
        "-s WASM=1",                        # Specify wasm output
        " -s EXPORTED_FUNCTIONS=\"['_malloc', '_free', '_encodeWithDictionary']\"",
    ],
    deps = [
        "@org_brotli//:brotlienc",
        "@org_brotli//:brotlicommon",
    ],
)

cc_binary(
    name = "generate.js",
    srcs = ["generate.cc"],
    linkopts = [
        "--bind",
        "-O3",
        "--closure 1",
        "-s MODULARIZE=1",
        "-s NO_FILESYSTEM=1",
        "-s TOTAL_MEMORY=318767104",
        "-s WASM=1",
        " -s EXPORTED_FUNCTIONS=\"['_malloc', '_free']\"",
    ],
    deps = [
        "@org_brotli//research:durchschlag",
    ],
)

wasm_cc_binary(
    name = "compress",
    cc_target = ":compress.js",
)

wasm_cc_binary(
    name = "generate",
    cc_target = ":generate.js",
)
