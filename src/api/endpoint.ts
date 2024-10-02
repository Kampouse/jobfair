import { jobStandManager, userManager } from "./query";

export async function getUsers({
  limit = 10,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}) {
  const users = await userManager.getAllUsersWithRatings(limit, offset);

  return users.map((user) => {
    const avg =
      user.ratings.reduce((sum, rating) => sum + rating.score, 0) /
      user.ratings.length;
    return {
      name: user.name,
      email: user.email,
      rating: avg,
      votes: user.ratings.length,
    };
  });
}

export async function castVote(userId: number | string, score: number) {
  try {
    const user = await userManager.getUser(userId);

    await userManager.createRating(user[0].id, score);
    const data = await userManager.getUserRating(user[0].id);
    const average =
      data.reduce((sum, rating) => sum + rating.score, 0) / data.length;

    return {
      success: true,
      message: "Vote cast successfully",
      average: average,
    };
  } catch (error) {
    console.error("Error casting vote:", error);
    return { success: false, message: "Failed to cast vote" };
  }
}
export async function createJobStand(
  standNumber: number,
  companyName: string,
  positionType: string,
  viable: string,
) {
  try {
    const newStand = await jobStandManager.createJobStand({
      standNumber: standNumber,
      companyName: companyName,
      positionType: positionType,
      viable: viable,
    });
    return {
      success: true,
      message: "Job stand created successfully",
      stand: newStand,
    };
  } catch (error) {
    console.error("Error creating job stand:", error);
    return { success: false, message: "Failed to create job stand" };
  }
}

export async function getJobStands({
  limit = 10,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}) {
  try {
    const stands = await jobStandManager.getAllJobStands(limit, offset);
    return stands;
  } catch (error) {
    console.error("Error fetching job stands:", error);
    return [];
  }
}

export async function updateJobStand(
  standId: number,
  updateData: Partial<{
    standNumber: number;
    companyName: string;
    positionType: string;
    viable: stirng;
  }>,
) {
  try {
    const updatedStand = await jobStandManager.updateJobStand(
      standId,
      updateData,
    );
    return {
      success: true,
      message: "Job stand updated successfully",
      stand: updatedStand,
    };
  } catch (error) {
    console.error("Error updating job stand:", error);
    return { success: false, message: "Failed to update job stand" };
  }
}

export async function deleteJobStand(standId: number) {
  try {
    await jobStandManager.deleteJobStand(standId);
    return {
      success: true,
      message: "Job stand deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting job stand:", error);
    return { success: false, message: "Failed to delete job stand" };
  }
}
// Usage example:
