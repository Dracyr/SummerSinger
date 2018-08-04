defmodule Munkres do
  use Rustler, otp_app: :summer_singer, crate: :munkres

  # When loading a NIF module, dummy clauses for all NIF function are required.
  # NIF dummies usually just error out when called when the NIF is not loaded, as that should never normally happen.
  def compute_native(_costs), do: :erlang.nif_error(:nif_not_loaded)

  def compute(costs) do
    {costs, rows, cols} = make_square(costs)
    {:ok, pairs} = Munkres.compute_native(costs)
    filter_original_costs(pairs, rows, cols)
  end

  defp make_square(matrix) do
    rows = length(matrix)
    cols = length(Enum.at(matrix, 0))
    matrix =
      cond do
        rows > cols -> add_cols(matrix, rows - cols)
        rows < cols -> add_rows(matrix, cols - rows, cols)
        true -> matrix
      end

     {matrix, rows, cols}
  end

  defp add_cols(matrix, n) do
    matrix
    |> Enum.map(fn row -> row ++ List.duplicate(0.0, n)  end)
  end

  defp add_rows(matrix, n, m) do
    matrix ++ List.duplicate(List.duplicate(0.0, m), n)
  end

  defp filter_original_costs(pairs, rows, cols) do
    pairs
    |> Enum.filter(fn {r, c} -> r < rows && c < cols end)
  end
end
