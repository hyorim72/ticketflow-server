const supabase = require("../lib/supabase");

// [과제 1] 공연 목록 조회
async function getPerformances(req, res, next) {
  try {
    // TODO 1-1. performances 테이블에서 모든 데이터 조회
    const { data, error } = await supabase
      .from("performances")
      .select("*")

      // TODO 1-2. id 기준 오름차순 정렬
      .order("id", { ascending: true });

    if (error) throw error;

    // TODO 1-3. 조회 결과를 JSON으로 응답
    return res.json(data);
  } catch (error) {
    next(error);
  }
}

// [과제 2] 공연 등록
async function createPerformance(req, res, next) {
  try {
    // TODO 2-1. 요청 Body에서 공연 정보 가져오기
    const { title, venue, starts_at, price } = req.body || {};

    // TODO 2-2. 필수값 확인

    if (!title || !venue || !starts_at || price === undefined) {
      return res.status(400).json({ error: "필수값을 모두 입력해 주세요." });
    }

    if (isNaN(Date.parse(starts_at))) {
      return res.status(400).json({ error: "올바른 날짜를 입력해 주세요." });
    }

    if (!Number.isInteger(price) || price < 0) {
      return res
        .status(400)
        .json({ error: "price는 0 이상의 정수여야 합니다." });
    }

    // TODO 2-3. Supabase에 데이터 등록
    const { data, error } = await supabase
      .from("performances")
      .insert({ title, venue, starts_at, price })
      .select()
      .single();

    if (error) throw error;

    // TODO 2-4. 등록 결과 반환
    return res.status(201).json({
      message: "공연 등록 완료",
      performance: data,
    });
  } catch (error) {
    next(error);
  }
}

// [과제 3] 공연 수정
async function updatePerformance(req, res, next) {
  try {
    // TODO 3-1. 요청 URL에서 id 가져오기
    const { id } = req.params;
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: "올바른 공연 ID를 입력해 주세요." });
    }
    // TODO 3-2. 수정할 공연 정보 가져오기
    const updates = req.body || {};
    // TODO 3-3. 입력값 검증

    const updateData = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.venue !== undefined) updateData.venue = updates.venue;
    if (updates.starts_at !== undefined)
      updateData.starts_at = updates.starts_at;
    if (updates.price !== undefined) updateData.price = updates.price;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "수정할 항목이 없습니다." });
    }

    // TODO 3-4. Supabase 데이터 수정

    const { data, error } = await supabase
      .from("performances")
      .update(updateData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "공연을 찾을 수 없습니다." });
    }

    // TODO 3-5. 수정 결과 반환

    return res.json({
      message: "공연 수정 완료",
      performance: data,
    });
  } catch (error) {
    next(error);
  }
}

// [과제 4] 공연 삭제
async function deletePerformance(req, res, next) {
  try {
    // TODO 4-1. 요청 URL에서 id 가져오기
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: "올바른 공연 ID를 입력해 주세요." });
    }

    // TODO 4-2. Supabase 데이터 삭제
    const { data, error } = await supabase
      .from("performances")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "공연을 찾을 수 없습니다." });
    }
    // TODO 4-3. 삭제 결과 반환
    return res.json({ message: "공연 삭제 완료" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPerformances,
  createPerformance,
  updatePerformance,
  deletePerformance,
};
