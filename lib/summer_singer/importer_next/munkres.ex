defmodule Munkres do
  @doc """
    Step 0:  Create an nxm  matrix called the cost matrix in which each element
      represents the cost of assigning one of n workers to one of m jobs.
      Rotate the matrix so that there are at least as many columns as rows
      and let k=min(n,m).
  """
  def compute(costs) do
    n = length(costs)

    state = %{
      n: n,
      m: length(Enum.at(costs, 0)),
      k: min(length(costs), length(Enum.at(costs, 0))),
      row_covered: List.duplicate(false, n),
      col_covered: List.duplicate(false, n),
      mask: List.duplicate(List.duplicate(0, n), n)
    }

    costs
    |> step(1, state)

    # |> step(2)
    # |> step(3)
    # |> step(4)
    # |> step(5)
    # |> step(6)
  end

  @doc """
    Step 1:  For each row of the matrix, find the smallest element and
      subtract it from every element in its row.
      Go to Step 2.
  """
  def step(costs, 1, state) do
    Enum.map(costs, fn row ->
      smallest_value = Enum.min(row)
      Enum.map(row, &(&1 - smallest_value))
    end)
    |> step(2, state)
  end

  @doc """
    Step 2:  Find a zero (Z) in the resulting matrix.
      If there is no starred zero in its row or column, star Z.
      Repeat for each element in the matrix.
      Go to Step 3.
  """
  def step(costs, 2, state) do
    reduce_state = {state[:row_covered], state[:col_covered], state[:mask]}

    {_, _, new_mask} =
      reduce_matrix(state[:n] - 1, reduce_state, fn row_index, col_index, state_acc ->
        cost_element = get_matrix_el(costs, row_index, col_index)
        {col_covered, row_covered, mask} = state_acc

        if cost_element == 0.0 && !Enum.at(row_covered, row_index) &&
             !Enum.at(col_covered, col_index) do
          {
            List.replace_at(row_covered, row_index, true),
            List.replace_at(col_covered, col_index, true),
            set_matrix_el(mask, row_index, col_index, 1)
          }
        else
          {row_covered, col_covered, mask}
        end
      end)

    step(costs, 3, Map.put(state, :mask, new_mask))
  end

  @doc """
    Step 3:  Cover each column containing a starred zero.
    If K columns are covered, the starred zeros describe
    a complete set of unique assignments.
    In this case, Go to DONE, otherwise, Go to Step 4.
  """
  def step(costs, 3, state) do
    col_covered =
      reduce_matrix(state[:n], state[:col_covered], fn row_index, col_index, col_covered ->
        if get_matrix_el(state[:mask], row_index, col_index) == 1 do
          List.replace_at(col_covered, col_index, true)
        else
          col_covered
        end
      end)

    state = Map.put(state, :col_covered, col_covered)
    covered_count = Enum.count(col_covered, & &1)

    if covered_count >= state[:n] || covered_count >= state[:m] do
      step(costs, 7, state)
    else
      step(costs, 4, state)
    end
  end

  @doc """
    Step 4:  Find a noncovered zero and prime it.
    If there is no starred zero in the row containing this primed zero, Go to Step 5.
    Otherwise, cover this row and uncover the column containing the starred zero.
    Continue in this manner until there are no uncovered zeros left.
    Save the smallest uncovered value and Go to Step 6.
  """
  def step(costs, 4, state) do
    {:ok, row, col} = find_zero(costs, state)
  end

  @doc """
    Step 5:  Construct a series of alternating primed and starred zeros as follows.
    Let Z0 represent the uncovered primed zero found in Step 4.
    Let Z1 denote the starred zero in the column of Z0 (if any).
    Let Z2 denote the primed zero in the row of Z1 (there will always be one).
    Continue until the series terminates at a primed zero that has no starred zero in its column.
    Unstar each starred zero of the series, star each primed zero of the series,
    erase all primes and uncover every line in the matrix.
    Return to Step 3.
  """
  def step(costs, 5) do
  end

  @doc """
    Step 6:  Add the value found in Step 4 to every element of each covered row,
    and subtract it from every element of each uncovered column.
    Return to Step 4 without altering any stars, primes, or covered lines.
  """
  def step(costs, 6) do
  end

  # DONE:  Assignment pairs are indicated by the positions of the starred zeros in the cost matrix.
  #   If C(i,j) is a starred zero, then the element associated with row i is assigned to the
  # element associated with column j.
  def step(costs, 7, state) do
    IO.inspect("WOW DONE")
    IO.inspect(state)
  end

  def find_zero(costs, %{row_covered: rows, col_covered: cols} = state) do
  end

  # Set element at [row, col] in matrix to value
  defp set_matrix_el(matrix, row, col, value) do
    List.replace_at(matrix, row, List.replace_at(Enum.at(matrix, row), col, value))
  end

  defp get_matrix_el(matrix, row, col) do
    Enum.at(matrix, row)
    |> Enum.at(col)
  end

  defp reduce_matrix(n, state, fn_reduce) do
    index_list = Enum.to_list(0..n)

    Enum.reduce(index_list, state, fn row_index, row_acc ->
      Enum.reduce(index_list, row_acc, fn col_index, col_acc ->
        fn_reduce.(row_index, col_index, col_acc)
      end)
    end)
  end
end
