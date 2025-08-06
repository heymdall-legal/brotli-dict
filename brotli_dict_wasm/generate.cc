#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <string>
#include "research/durchschlag.h"

using namespace emscripten;

std::string generate_dictionary(
    size_t dictionary_size_limit,
    size_t slice_len,
    size_t block_len,
    const val& sample_sizes_js,
    const val& sample_data_js_array
) {
    // Convert sizes array from JavaScript
    std::vector<size_t> sample_sizes;
    unsigned int sizes_length = sample_sizes_js["length"].as<unsigned int>();
    for (unsigned int i = 0; i < sizes_length; ++i) {
        sample_sizes.push_back(sample_sizes_js[i].as<size_t>());
    }
    
    // Flatten all sample data arrays into a single buffer
    std::vector<uint8_t> flattened_data;
    unsigned int data_length = sample_data_js_array["length"].as<unsigned int>();
    
    for (unsigned int i = 0; i < data_length; ++i) {
        val sample_data_js = sample_data_js_array[i];
        unsigned int sample_length = sample_data_js["length"].as<unsigned int>();
        
        for (unsigned int j = 0; j < sample_length; ++j) {
            flattened_data.push_back(sample_data_js[j].as<uint8_t>());
        }
    }

    return durchschlag_generate(
        dictionary_size_limit,
        slice_len,
        block_len,
        sample_sizes,
        flattened_data.data()
    );
}

EMSCRIPTEN_BINDINGS(BrotliDict) {
    function("generate_dictionary", &generate_dictionary);
}
