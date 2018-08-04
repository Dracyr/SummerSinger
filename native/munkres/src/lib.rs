#[macro_use] extern crate rustler;
#[macro_use] extern crate rustler_codegen;
#[macro_use] extern crate lazy_static;
extern crate munkres;

use rustler::{Env, Term, NifResult, Encoder};
use munkres::{WeightMatrix, solve_assignment};

mod atoms {
    rustler_atoms! {
        atom ok;
        //atom error;
        //atom __true__ = "true";
        //atom __false__ = "false";
    }
}

rustler_export_nifs! {
    "Elixir.Munkres",
    [("compute_native", 1, compute_native)],
    None
}

fn compute_native<'a>(env: Env<'a>, args: &[Term<'a>]) -> NifResult<Term<'a>> {
    let nested_array: Vec<Vec<f64>> = try!(args[0].decode());
    let c: Vec<f64> = nested_array
                        .iter()
                        .flat_map(|array| array.iter())
                        .cloned()
                        .collect();

    let mut weights: WeightMatrix<f64> = WeightMatrix::from_row_vec(nested_array.len(), c);
    let matching = solve_assignment(&mut weights).unwrap();

    Ok((atoms::ok(), matching).encode(env))
}
